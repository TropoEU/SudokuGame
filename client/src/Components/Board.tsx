import React, { useState, lazy, Suspense, MouseEvent } from 'react';
import { BoardType } from '../Interfaces/types';
import {
	generateEmptyBoard,
	generateSudoku,
	isSolvedCorrectly,
} from '../sodukuGame';
import '../Styles/Board.css'; // Custom styles

const NumberPicker = lazy(() => import('./NumberPicker'));

interface BoardProps {
	initialBoard?: BoardType;
}

export function Board({
	initialBoard = generateEmptyBoard(),
}: BoardProps): React.ReactElement {
	const [board, setBoard] = useState<BoardType>(initialBoard);
	const [pickerVisible, setPickerVisible] = useState<boolean>(false);
	const [pickerPosition, setPickerPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [selectedCell, setSelectedCell] = useState<number | null>(null);
	const [message, setMessage] = useState<string>('');

	const handleChange = (index: number, value: string) => {
		if (/^[1-9]$/.test(value) || value === '') {
			const newBoard = board.map((cell, i) => (i === index ? value : cell));
			setBoard(newBoard);
		}
	};

	const handleCellClick = (e: MouseEvent<HTMLDivElement>, index: number) => {
		const { top, left } = (e.target as HTMLElement).getBoundingClientRect();
		setSelectedCell(index);
		setPickerPosition({
			top: top + window.scrollY,
			left: left + window.scrollX,
		});
		setPickerVisible(true);
	};

	const handleNumberSelect = (number: string) => {
		if (selectedCell !== null) {
			handleChange(selectedCell, number);
			setPickerVisible(false);
		}
	};

	const handlePickerClose = () => {
		setPickerVisible(false);
	};

	const handleClearBoard = () => {
		setBoard(generateEmptyBoard());
		setMessage('');
	};

	const handleResetBoard = () => {
		setBoard(initialBoard);
		setMessage('');
	};

	const handleGenerateSudoku = () => {
		setBoard(generateSudoku());
		setMessage('');
	};

	const handleCheckSolution = () => {
		if (isSolvedCorrectly(board)) {
			setMessage('Correct!');
		} else {
			setMessage('Nope.');
		}
	};

	return (
		<div className='board-container'>
			<div className='board'>
				{board.map((cell, index) => (
					<div
						key={index}
						className='board-cell'
						data-cellindex={index}
						onClick={(e) => handleCellClick(e, index)}
					>
						{cell} {/* Display the index of each cell */}
					</div>
				))}
				{pickerVisible && pickerPosition && (
					<Suspense fallback={<div>Loading...</div>}>
						<NumberPicker
							top={pickerPosition.top}
							left={pickerPosition.left}
							onSelect={handleNumberSelect}
							onClose={handlePickerClose}
						/>
					</Suspense>
				)}
			</div>
			<br />
			<div className='board-controls'>
				<button onClick={handleGenerateSudoku}>Generate Sudoku</button>
				<button onClick={handleClearBoard}>Clear Board</button>
				<button onClick={handleResetBoard}>Reset Board</button>
				<button onClick={handleCheckSolution}>Check Solution</button>
			</div>
			<p>{message}</p>
		</div>
	);
}
