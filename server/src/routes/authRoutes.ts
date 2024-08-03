import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import authenticate, { AuthenticatedRequest } from '../middleware/authenticate';
import { JWT_SECRET, GOOGLE_CLIENT_ID } from '../config';

const router = express.Router();

// Ensure required environment variables are set
if (!JWT_SECRET || !GOOGLE_CLIENT_ID) {
	throw new Error('Missing required environment variables');
}

// Create a new OAuth2 client with your client ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Google authentication route
router.post('/google', async (req: Request, res: Response) => {
	try {
		const idToken = req.body.tokenId;

		if (!idToken) {
			return res.status(400).json({ message: 'idToken is required' });
		}

		const ticket = await client.verifyIdToken({
			idToken,
			audience: GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (payload) {
			const { sub: userId, email, name } = payload;

			let user = await User.findOne({ googleId: userId });
			if (!user) {
				user = new User({ googleId: userId, email, username: name, level: 1 });
				await user.save();
			}

			const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
				expiresIn: '1h',
			});

			res.json({ token, user: { username: user.username, level: user.level } });
		} else {
			res.status(400).json({ message: 'Invalid token' });
		}
	} catch (error) {
		console.error('Error verifying token:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

// Registration route
router.post('/register', async (req: Request, res: Response) => {
	const { username, email, password } = req.body;
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			username,
			email,
			password: hashedPassword,
			level: 1,
		});
		await user.save();

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: '1h',
		});

		res.status(201).json({
			message: 'User created',
			token,
			user: { username: user.username, level: user.level },
		});
	} catch (err) {
		res.status(500).json({ error: 'Failed to register user' });
	}
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		if (!user.password) {
			return res.status(400).json({ error: 'User password not set' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: '1h',
		});

		res.json({ token, user: { username: user.username, level: user.level } });
	} catch (err) {
		res.status(500).json({ error: 'Failed to login user' });
	}
});

// Verify token route
router.post(
	'/verify-token',
	authenticate,
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user.userId;

			const user = await User.findById(userId);

			if (!user) {
				return res
					.status(404)
					.json({ valid: false, message: 'User not found' });
			}

			res.json({
				valid: true,
				user: { username: user.username, level: user.level },
			});
		} catch (error) {
			res.status(401).json({ valid: false, message: 'Invalid token' });
		}
	},
);

export default router;
