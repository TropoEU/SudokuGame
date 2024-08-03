import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String },
	email: { type: String, unique: true, required: true },
	googleId: { type: String, unique: true },
	level: { type: Number, default: 1 },
});

export const User = model('User', userSchema);
