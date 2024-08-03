import { Schema, model, Document } from 'mongoose';

interface IGame extends Document {
	userId: Schema.Types.ObjectId;
	completeBoard: string[];
	initialBoard: string[];
	currentState: string[];
	createdAt: Date;
}

const gameSchema = new Schema<IGame>({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	completeBoard: { type: [String], required: true },
	initialBoard: { type: [String], required: true },
	currentState: { type: [String], required: true },
	createdAt: { type: Date, default: Date.now },
});

const Game = model<IGame>('Game', gameSchema);
export default Game;
