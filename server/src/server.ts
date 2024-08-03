import './config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI!;

// Ensure required environment variables are set
if (!MONGODB_URI) {
	throw new Error('Missing required environment variables');
}

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
// Use the authRoutes router for routes starting with /api/auth
app.use('/api/auth', authRoutes);

// Use the gameRoutes router for routes starting with /api/game
app.use('/api/game', gameRoutes);

app.get('/', (req: Request, res: Response) => {
	res.send('Server is live');
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
