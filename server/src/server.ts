import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create a new OAuth2 client with your client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

// Route to verify Google token
app.post('/api/auth/google', async (req: Request, res: Response) => {
	try {
		const idToken = req.body.tokenId;

		console.log(req.body);
		console.log(idToken);

		if (!idToken) {
			return res.status(400).json({ message: 'idToken is required' });
		}

		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (payload) {
			const { sub: userId, email, name } = payload;

			// Handle the user information as needed
			// For example, find or create user in your database

			res.json({ userId, email, name });
		} else {
			res.status(400).json({ message: 'Invalid token' });
		}
	} catch (error) {
		console.error('Error verifying token:', error);
		res.status(500).json({ message: 'Internal Server Error' });
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
