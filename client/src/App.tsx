import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import { Board } from './Components/Board';
import endpoints from './config';
import { post } from './Utils/apiUtils';
import { BoardType } from './Interfaces/types';
import Button from './Components/Button';
import Dialog from './Components/Dialog';
import GameOfLife from './Components/GameOfLife';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isGameOfLife, setIsGameOfLife] = useState(false);
	const [user, setUser] = useState<{ username: string; level: number } | null>(
		null,
	);
	const [game, setGame] = useState<{
		initialBoard: BoardType;
		currentState: BoardType;
	}>({ initialBoard: [], currentState: [] });

	const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
	const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const response = await post(endpoints.VERIFY_TOKEN, {});
				if (response.data?.user?.username) {
					setIsLoggedIn(true);
					setUser(response.data.user);
					setGame(response.data.game);
				} else {
					setIsLoggedIn(false);
					setUser(null);
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('game');
				}
			} catch (error) {
				setIsLoggedIn(false);
				setUser(null);
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				localStorage.removeItem('game');
			}
		};

		if (localStorage.getItem('token')) {
			verifyToken();
		}
	}, []);

	const handleLogin = (
		user: { username: string; level: number },
		game: {
			initialBoard: BoardType;
			currentState: BoardType;
		},
	) => {
		setIsLoggedIn(true);
		setUser(user);
		setGame(game);
		setRegisterDialogOpen(false);
		setLoginDialogOpen(false);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
		setUser(null);
		setGame({ initialBoard: [], currentState: [] });
	};

	const handleNewGame = (
		user: { username: string; level: number } | null,
		game: {
			initialBoard: BoardType;
			currentState: BoardType;
		},
	) => {
		setUser(user);
		setGame(game);
	};

	return (
		<div className='App'>
			<header className='App-header'>
				{!isGameOfLife ? <h1>Sudoku Game</h1> : null}
				{isGameOfLife ? (
					<GameOfLife
						onBackCallback={() => {
							setIsGameOfLife(false);
						}}
					/>
				) : (
					<>
						{isLoggedIn ? (
							<div>
								<p>Welcome, {user?.username}!</p>
								<p>Level: {user?.level}</p>
								<Board
									initialBoard={game.initialBoard}
									currentBoard={game.currentState}
									newGameCallback={handleNewGame}
								/>
								<Button onClick={handleLogout}>Logout</Button>
							</div>
						) : (
							<div className='auth-container'>
								<div className='auth-container'>
									<Button fullWidth onClick={() => setLoginDialogOpen(true)}>
										Login
									</Button>
									<Button fullWidth onClick={() => setRegisterDialogOpen(true)}>
										Register
									</Button>
									<Button
										fullWidth
										onClick={() => {
											setIsGameOfLife(true);
										}}
									>
										Game of Life
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</header>
			<Dialog
				isOpen={isLoginDialogOpen}
				onClose={() => setLoginDialogOpen(false)}
				title='Login'
			>
				<Login onLogin={handleLogin} />
			</Dialog>

			<Dialog
				isOpen={isRegisterDialogOpen}
				onClose={() => setRegisterDialogOpen(false)}
				title='Register'
			>
				<Register onLogin={handleLogin} />
			</Dialog>
		</div>
	);
}

export default App;
