import dotenv from 'dotenv';

dotenv.config();

if (
	!process.env.JWT_SECRET ||
	!process.env.GOOGLE_CLIENT_ID ||
	!process.env.MONGODB_URI
) {
	throw new Error('Missing required environment variables');
}

export const JWT_SECRET = process.env.JWT_SECRET!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const MONGODB_URI = process.env.MONGODB_URI!;
