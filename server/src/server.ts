import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

// Ensure required environment variables are set
if (!MONGODB_URI || !JWT_SECRET || !GOOGLE_CLIENT_ID) {
	throw new Error('Missing required environment variables');
}

// Create a new OAuth2 client with your client ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Connect to MongoDB
mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

// Routes
app.get('/', (req: Request, res: Response) => {
	res.send('Server is live');
});

// Authentication routes
app.post('/api/auth/google', async (req: Request, res: Response) => {
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

app.post('/api/auth/register', async (req, res) => {
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

app.post('/api/auth/login', async (req, res) => {
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

app.post('/api/auth/verify-token', async (req, res) => {
	const token = req.body.token;

	if (!token) {
		return res.status(400).json({ valid: false, message: 'Token is required' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const userId = decoded.userId;

		if (typeof userId !== 'string') {
			return res.status(400).json({ valid: false, message: 'Invalid token' });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ valid: false, message: 'User not found' });
		}

		res.json({
			valid: true,
			user: { username: user.username, level: user.level },
		});
	} catch (error) {
		res.status(401).json({ valid: false, message: 'Invalid token' });
	}
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
