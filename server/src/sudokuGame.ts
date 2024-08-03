import { BoardType } from './Interfaces/types';

export const generateEmptyBoard = (): BoardType => {
	const board: BoardType = [];
	for (let i = 0; i < 81; i++) {
		board.push(''); // Initial empty values
	}
	return board;
};

const shuffleArray = (array: number[]): number[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

const isSafe = (
	board: BoardType,
	row: number,
	col: number,
	num: number,
): boolean => {
	for (let x = 0; x < 9; x++) {
		if (board[row * 9 + x] == num.toString()) return false;
		if (board[x * 9 + col] == num.toString()) return false;
		if (
			board[
				(Math.floor(row / 3) * 3 + Math.floor(x / 3)) * 9 +
					(Math.floor(col / 3) * 3 + (x % 3))
			] == num.toString()
		)
			return false;
	}
	return true;
};

const solveBoard = (board: BoardType): boolean => {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row * 9 + col] === '') {
				const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
				for (let num of numbers) {
					if (isSafe(board, row, col, num)) {
						board[row * 9 + col] = num.toString();
						if (solveBoard(board)) return true;
						board[row * 9 + col] = '';
					}
				}
				return false;
			}
		}
	}
	return true;
};

const generateCompleteBoard = (): BoardType => {
	const board = generateEmptyBoard();
	solveBoard(board);
	return board;
};

const removeCells = (board: BoardType, count: number): BoardType => {
	const newBoard = [...board];
	for (let i = 0; i < count; i++) {
		let cell = Math.floor(Math.random() * 81);
		while (newBoard[cell] === '') {
			cell = Math.floor(Math.random() * 81);
		}
		newBoard[cell] = '';
	}
	return newBoard;
};

export const generateSudoku = (
	cellsToRemove: number = 40,
): { completeBoard: BoardType; initialBoard: BoardType } => {
	const completeBoard = generateCompleteBoard();
	const initialBoard = removeCells(completeBoard, cellsToRemove);
	return { completeBoard, initialBoard };
};

const hasAllDigits = (arr: string[]): boolean => {
	const digits = new Set(arr);
	return digits.size === 9 && !digits.has('');
};

export const isSolvedCorrectly = (board: BoardType): boolean => {
	// Check rows
	for (let row = 0; row < 9; row++) {
		const rowStartIndex = row * 9;
		const rowArr = board.slice(rowStartIndex, rowStartIndex + 9);
		if (!hasAllDigits(rowArr)) return false;
	}

	// Check columns
	for (let col = 0; col < 9; col++) {
		const colArr = [];
		for (let row = 0; row < 9; row++) {
			colArr.push(board[row * 9 + col]);
		}
		if (!hasAllDigits(colArr)) return false;
	}

	// Check 3x3 subgrids
	for (let grid = 0; grid < 9; grid++) {
		const gridArr = [];
		const rowStart = Math.floor(grid / 3) * 3;
		const colStart = (grid % 3) * 3;
		for (let row = rowStart; row < rowStart + 3; row++) {
			for (let col = colStart; col < colStart + 3; col++) {
				gridArr.push(board[row * 9 + col]);
			}
		}
		if (!hasAllDigits(gridArr)) return false;
	}

	return true;
};
