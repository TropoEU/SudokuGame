import express, { Response } from 'express';
import Game from '../models/Game';
import { generateSudoku, isSolvedCorrectly } from '../sudokuGame';
import authenticate, { AuthenticatedRequest } from '../middleware/authenticate';
import User from '../models/User';

const router = express.Router(); // Create a new router instance

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

router.post(
	'/check',
	authenticate,
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { userId } = req.user; // Assuming userId is stored in the token
			const { currentState } = req.body;
			if (isSolvedCorrectly(currentState)) {
				// Find the user by userId and increment their level by 1
				const user = await User.findByIdAndUpdate(
					userId,
					{ $inc: { level: 1 } },
					{ new: true }, // Return the updated document
				);

				if (!user) {
					return res.status(404).json({ error: 'User not found' });
				}

				const { completeBoard, initialBoard } = generateSudoku(
					5 + Math.floor(user!.level / 5),
				);

				const newGame = new Game({
					userId,
					completeBoard,
					initialBoard,
					currentState: [...initialBoard],
				});

				const game = await Game.findOne({ userId }).sort({ createdAt: -1 });
				if (game) {
					game.completeBoard = newGame.completeBoard;
					game.initialBoard = newGame.initialBoard;
					game.currentState = [...newGame.initialBoard];
					await game.save();
					res.status(200).json({ user: user, game: game });
				} else {
					await newGame.save();
					res.status(200).json({ user: user, game: newGame });
				}
			} else {
				res.status(204).json({ error: 'Game solution is wrong.' });
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
