import express, { Response } from 'express';
import Game from '../models/Game';
import { generateSudoku } from '../sudokuGame';
import authenticate, { AuthenticatedRequest } from '../middleware/authenticate';

const router = express.Router(); // Create a new router instance

// Generate a new Sudoku game
router.post(
	'/generate',
	authenticate,
	async (req: AuthenticatedRequest, res: Response) => {
		const { userId } = req.user; // Assuming userId is stored in the token
		const { completeBoard, initialBoard } = generateSudoku();
		const game = new Game({
			userId,
			completeBoard,
			initialBoard,
			currentState: [...initialBoard],
		});
		try {
			await game.save();
			res.status(201).json(game);
		} catch (err: unknown) {
			if (err instanceof Error) {
				res.status(400).json({ error: err.message });
			} else {
				res.status(400).json({ error: 'An unknown error occurred.' });
			}
		}
	},
);

// Save the current state of the game
router.post(
	'/save',
	authenticate,
	async (req: AuthenticatedRequest, res: Response) => {
		const { userId } = req.user; // Assuming userId is stored in the token
		const { currentState } = req.body;
		try {
			const game = await Game.findOne({ userId }).sort({ createdAt: -1 });
			if (game) {
				game.currentState = currentState;
				await game.save();
				res.status(200).json(game);
			} else {
				res.status(404).json({ error: 'Game not found' });
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				res.status(400).json({ error: err.message });
			} else {
				res.status(400).json({ error: 'An unknown error occurred.' });
			}
		}
	},
);

// Get the current game state
router.get(
	'/current',
	authenticate,
	async (req: AuthenticatedRequest, res: Response) => {
		const { userId } = req.user; // Assuming userId is stored in the token
		try {
			const game = await Game.findOne({ userId }).sort({ createdAt: -1 });
			if (game) {
				res.status(200).json(game);
			} else {
				res.status(404).json({ error: 'Game not found' });
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				res.status(400).json({ error: err.message });
			} else {
				res.status(400).json({ error: 'An unknown error occurred.' });
			}
		}
	},
);

export default router;
