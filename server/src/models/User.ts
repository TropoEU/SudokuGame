import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	level: number;
	googleId?: string | null; // Allow googleId to be null
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	level: { type: Number, default: 1 },
	googleId: { type: String, default: null },
});

// Create a partial index for googleId to ensure it is unique only if not null
userSchema.index(
	{ googleId: 1 },
	{ unique: true, partialFilterExpression: { googleId: { $type: 'string' } } },
);

const User = model<IUser>('User', userSchema);
export default User;
