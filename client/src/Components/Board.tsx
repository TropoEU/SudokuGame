import React, { useState, lazy, Suspense, MouseEvent } from 'react';
import { BoardType } from '../Interfaces/types';
import '../Styles/Board.css'; // Custom styles
import { post } from '../Utils/apiUtils';
import endpoints from '../config';

const NumberPicker = lazy(() => import('./NumberPicker'));

interface BoardProps {
	initialBoard: BoardType;
	currentBoard: BoardType;
	newGameCallback: CallableFunction;
}

export function Board({
	initialBoard,
	currentBoard,
	newGameCallback,
}: BoardProps): React.ReactElement {
	const [board, setBoard] = useState<BoardType>(currentBoard ?? initialBoard);
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
			saveGame(newBoard);
		}
	};

	const saveGame = async (newBoard = board) => {
		try {
			const response = await post(endpoints.SAVE_GAME, {
				currentState: newBoard,
			});

			// Assuming the response is successful, update the board state
			if (response.status === 200) {
				setBoard(newBoard);
			} else {
				// Handle any errors from the response if necessary
				console.error('Failed to save game:', response.statusText);
			}
		} catch (error) {
			// Handle any errors from the request
			console.error('Error saving game:', error);
		}
	};

	const checkSolution = async () => {
		try {
			const response = await post(endpoints.CHECK_GAME, {
				currentState: board,
			});

			// Assuming the response is successful, but failed the game
			if (response.status === 204) {
				setBoard(board);
				setMessage('Nope.');
			} else if (response.status === 200) {
				setBoard(response.data.game.initialBoard);
				newGameCallback(response.data.user, response.data.game);
				setMessage('YES!');
			} else {
				// Handle any errors from the response if necessary
				console.error('Failed to save game:', response.statusText);
			}
		} catch (error) {
			// Handle any errors from the request
			console.error('Error saving game:', error);
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

	const handleResetBoard = () => {
		saveGame(initialBoard);
		setMessage('');
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
				<button onClick={checkSolution}>Check Solution</button>
				<button onClick={handleResetBoard}>Reset Board</button>
			</div>
			<p>{message}</p>
		</div>
	);
}
