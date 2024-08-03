import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import Game from '../models/Game'; // Ensure to import the Game model
import authenticate, { AuthenticatedRequest } from '../middleware/authenticate';
import { JWT_SECRET, GOOGLE_CLIENT_ID } from '../config';
import { generateSudoku } from '../sudokuGame';
import { BoardType } from '../Interfaces/types';

const router = express.Router();

if (!JWT_SECRET || !GOOGLE_CLIENT_ID) {
	throw new Error('Missing required environment variables');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const createTokenResponse = async (user: any) => {
	const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
		expiresIn: '48h',
	});

	let game = await Game.findOne({ userId: user._id }).sort({ createdAt: -1 });

	let newBoard: { completeBoard: BoardType; initialBoard: BoardType } = {
		completeBoard: [],
		initialBoard: [],
	};
	if (!game?.initialBoard || game.initialBoard.length === 0) {
		newBoard = generateSudoku(5 + Math.floor(user.level / 5));

		// Save the new board to the database
		const newGame = new Game({
			userId: user._id,
			completeBoard: newBoard.completeBoard,
			initialBoard: newBoard.initialBoard,
			currentState: newBoard.initialBoard,
		});

		await newGame.save();
		game = newGame;
	}

	return {
		token,
		user: { username: user.username, level: user.level },
		game: { initialBoard: game.initialBoard, currentState: game.currentState },
	};
};

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
			const { sub: googleId, email, name } = payload;

			let user = await User.findOne({ googleId });
			if (!user) {
				user = new User({ googleId, email, username: name, level: 1 });
				await user.save();
			}

			const response = await createTokenResponse(user);
			res.json(response);
		} else {
			res.status(400).json({ message: 'Invalid token' });
		}
	} catch (error) {
		console.error('Error verifying token:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

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

		const response = await createTokenResponse(user);
		res.status(201).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Failed to register user' });
	}
});

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

		const response = await createTokenResponse(user);
		res.json(response);
	} catch (err) {
		res.status(500).json({ error: 'Failed to login user' });
	}
});

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

			const response = await createTokenResponse(user);
			res.json(response);
		} catch (error) {
			res.status(401).json({ valid: false, message: 'Invalid token' });
		}
	},
);

export default router;
