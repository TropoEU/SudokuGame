import React, { useState, ChangeEvent } from 'react';
import '../Styles/Board.css'; // Import custom styles for the board

// Define the type for the board as a 2D array of strings
type Board = string[][];

// Define the props type for the Board component
interface BoardProps {
  initialBoard?: Board; // Optional initial board state
}

// Function to generate an initial empty board
const generateBoard = (): Board => {
  const board: Board = [];
  for (let i = 0; i < 9; i++) {
    const row: string[] = [];
    for (let j = 0; j < 9; j++) {
      row.push(''); // Initialize each cell with an empty string
    }
    board.push(row);
  }
  return board;
};

// Define the Board component with optional initial board state
export function Board({ initialBoard = generateBoard() }: BoardProps): React.ReactElement {
  const [board, setBoard] = useState<Board>(initialBoard);

  // Function to handle cell value changes
  const handleChange = (rowIndex: number, cellIndex: number, value: string) => {
    const newBoard = board.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === cellIndex ? value : cell))
        : row
    );
    setBoard(newBoard);
  };

  // Function to handle input changes
  const handleInputChange = (rowIndex: number, cellIndex: number) => (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric values
    const value = e.target.value.replace(/[^1-9]/g, '');
    handleChange(rowIndex, cellIndex, value);
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <input
              key={cellIndex}
              type="text"
              maxLength={1}
              className="board-cell"
              value={cell}
              onChange={handleInputChange(rowIndex, cellIndex)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}