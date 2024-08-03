import mongoose from 'mongoose';
import User from './models/User'; // Adjust the import path as necessary
import { MONGODB_URI } from './config'; // Ensure you have your MongoDB URI

function isMongoError(error: unknown): error is { codeName: string } {
	return typeof error === 'object' && error !== null && 'codeName' in error;
}

async function dropIndex() {
	await mongoose.connect(MONGODB_URI);

	console.log('Connected to MongoDB');

	try {
		const result = await mongoose.connection
			.collection('users')
			.dropIndex('googleId_1');
		console.log('Index dropped:', result);
	} catch (error) {
		if (isMongoError(error) && error.codeName === 'IndexNotFound') {
			console.log('Index not found, skipping drop');
		} else {
			console.error('Error dropping index:', error);
		}
	} finally {
		await mongoose.disconnect();
		console.log('Disconnected from MongoDB');
	}
}

async function updateDatabase() {
	await mongoose.connect(MONGODB_URI);

	console.log('Connected to MongoDB');

	try {
		// Set googleId to null where it's not set
		await User.updateMany(
			{ googleId: { $exists: false } },
			{ $set: { googleId: null } },
		);

		console.log('Database updated successfully');
	} catch (error) {
		console.error('Error updating database:', error);
	} finally {
		await mongoose.disconnect();
		console.log('Disconnected from MongoDB');
	}
}

// dropIndex();
updateDatabase();
