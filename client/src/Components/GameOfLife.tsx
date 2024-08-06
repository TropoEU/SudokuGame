import React, { useState, useCallback, useRef } from 'react';
import '../Styles/GameOfLife.css';
import Button from './Button';

const numRows = 50;
const numCols = 50;

const directions = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0],
];

type Grid = boolean[];

const generateEmptyGrid = (): Grid => {
	return new Array<boolean>(numCols * numRows).fill(false);
};

type GameOfLifeProps = {
	onBackCallback: () => void;
};

const GameOfLife: React.FC<GameOfLifeProps> = ({ onBackCallback }) => {
	const [grid, setGrid] = useState<Grid>(() => {
		return generateEmptyGrid();
	});
	const [generation, setGeneraiton] = useState<number>(0);

	const [running, setRunning] = useState(false);
	const runningRef = useRef(running);
	runningRef.current = running;

	const runSimulation = useCallback(() => {
		if (!runningRef.current) {
			return;
		}

		setGrid((g: Grid): Grid => {
			const newGrid = generateEmptyGrid();

			for (let i = 0; i < newGrid.length; i++) {
				const row = Math.floor(i / numCols);
				const column = i % numCols;
				let neighbors = 0;

				directions.forEach(([x, y]) => {
					const newRow = row + x;
					const newCol = column + y;
					if (
						newRow >= 0 &&
						newRow < numRows &&
						newCol >= 0 &&
						newCol < numCols
					) {
						neighbors += g[newRow * numCols + newCol] ? 1 : 0;
					}
				});

				if (neighbors === 3 || (g[i] && neighbors === 2)) {
					newGrid[i] = true;
				} else {
					newGrid[i] = false;
				}
			}
			return newGrid;
		});
		setGeneraiton((prev) => prev + 1);
		setTimeout(runSimulation, 2);
	}, []);

	const gridStyle = {
		gridTemplateColumns: `repeat(${numCols}, 6px)`,
	};

	return (
		<div>
			<div className='controls'>
				<Button
					fullWidth
					onClick={() => {
						setRunning(!running);
						if (!running) {
							runningRef.current = true;
							runSimulation();
						}
					}}
				>
					{running ? 'Stop' : 'Start'}
				</Button>
				<Button
					fullWidth
					onClick={() => {
						setGrid(generateEmptyGrid());
						setGeneraiton(0);
					}}
				>
					Clear
				</Button>
				<Button
					fullWidth
					onClick={() => {
						const tempGrid = generateEmptyGrid();
						for (let i = 0; i < tempGrid.length; i++) {
							tempGrid[i] = Math.random() > 0.5 ? true : false;
						}
						setGrid(tempGrid);
						setGeneraiton(0);
					}}
				>
					Random
				</Button>
			</div>
			<div className='grid-container'>
				<div className='grid' style={gridStyle}>
					{grid.map((cell, index) => {
						const row = Math.floor(index / numCols);
						const col = index % numCols;

						return (
							<div
								key={`${row}-${col}`}
								onClick={() => {
									const newGrid = [...grid];
									newGrid[index] = grid[index] ? false : true;
									setGrid(newGrid);
								}}
								style={{
									width: 4,
									height: 4,
									backgroundColor: grid[index] ? 'white' : undefined,
									border: 'solid 1px gray',
								}}
							/>
						);
					})}
				</div>
			</div>
			{'Generation: ' + generation}
			<br />
			<Button onClick={onBackCallback}>Back</Button>
		</div>
	);
};

export default GameOfLife;
