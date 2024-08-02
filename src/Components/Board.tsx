import React, { useState, ChangeEvent } from 'react';
import '../Styles/Board.css'; // Optional: For custom styles

type BoardType = string[][];

interface BoardProps {
	initialBoard?: BoardType;
}

const generateBoard = (): BoardType => {
	const board: BoardType = [];
	const dd = 2;
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

	const handleChange = (rowIndex: number, cellIndex: number, value: string) => {
		const newBoard = board.map((row, rIdx) =>
			rIdx === rowIndex
				? row.map((cell, cIdx) => (cIdx === cellIndex ? value : cell))
				: row,
		);
		setBoard(newBoard);
	};

	const handleInputChange =
		(rowIndex: number, cellIndex: number) =>
		(e: ChangeEvent<HTMLInputElement>) => {
			handleChange(rowIndex, cellIndex, e.target.value);
		};

	return (
		<div className='board'>
			{board.map((row, rowIndex) => (
				<div key={rowIndex} className='board-row'>
					{row.map((cell, cellIndex) => (
						<input
							key={cellIndex}
							type='text'
							maxLength={1}
							className='board-cell'
							value={cell}
							onChange={handleInputChange(rowIndex, cellIndex)}
						/>
					))}
				</div>
			))}
		</div>
	);
}
