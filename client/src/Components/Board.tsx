import React, { useState, lazy, Suspense, MouseEvent } from 'react';
import '../Styles/Board.css'; // Optional: For custom styles

// Lazy load NumberPicker component
const NumberPicker = lazy(() => import('./NumberPicker'));

type BoardType = string[][];

interface BoardProps {
	initialBoard?: BoardType;
}

// Generate a blank 9x9 board
const generateBoard = (): BoardType => {
	const board: BoardType = [];
	for (let i = 0; i < 9; i++) {
		const row: string[] = [];
		for (let j = 0; j < 9; j++) {
			row.push(''); // Initial empty values
		}
		board.push(row);
	}
	return board;
};

export function Board({
	initialBoard = generateBoard(),
}: BoardProps): React.ReactElement {
	const [board, setBoard] = useState<BoardType>(initialBoard);
	const [pickerVisible, setPickerVisible] = useState<boolean>(false);
	const [pickerPosition, setPickerPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [selectedCell, setSelectedCell] = useState<{
		row: number;
		col: number;
	} | null>(null);

	// Update cell value in the board
	const handleChange = (rowIndex: number, cellIndex: number, value: string) => {
		const newBoard = board.map((row, rIdx) =>
			rIdx === rowIndex
				? row.map((cell, cIdx) => (cIdx === cellIndex ? value : cell))
				: row,
		);
		setBoard(newBoard);
	};

	// Handle cell click to show number picker
	const handleCellClick = (
		e: MouseEvent<HTMLDivElement>,
		rowIndex: number,
		cellIndex: number,
	) => {
		const { top, left } = (e.target as HTMLElement).getBoundingClientRect();
		setSelectedCell({ row: rowIndex, col: cellIndex });
		setPickerPosition({
			top: top + window.scrollY,
			left: left + window.scrollX,
		});
		setPickerVisible(true);
	};

	// Handle number selection from the picker
	const handleNumberSelect = (number: string) => {
		if (selectedCell) {
			handleChange(selectedCell.row, selectedCell.col, number);
			setPickerVisible(false);
		}
	};

	// Close the number picker
	const handlePickerClose = () => {
		setPickerVisible(false);
	};

	return (
		<div className='board'>
			{board.map((row, rowIndex) => (
				<div key={rowIndex} className='board-row'>
					{row.map((cell, cellIndex) => (
						<div
							key={cellIndex}
							className='board-cell'
							data-cellindex={rowIndex * 9 + cellIndex}
							onClick={(e) => handleCellClick(e, rowIndex, cellIndex)}
						>
							{cell}
						</div>
					))}
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
	);
}
