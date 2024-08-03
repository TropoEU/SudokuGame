import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import GoogleSignIn from './Components/GoogleSignIn';
import { Board } from './Components/Board';
import endpoints from './config';
import { post } from './Utils/apiUtils';
import { BoardType } from './Interfaces/types';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<{ username: string; level: number } | null>(
		null,
	);
	const [game, setGame] = useState<{
		initialBoard: BoardType;
		currentState: BoardType;
	}>({ initialBoard: [], currentState: [] });

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
				<h1>Sudoku Game</h1>
				{isLoggedIn ? (
					<div>
						<p>Welcome, {user?.username}!</p>
						<p>Level: {user?.level}</p>
						<Board
							initialBoard={game.initialBoard}
							currentBoard={game.currentState}
							newGameCallback={handleNewGame}
						/>
						<button onClick={handleLogout}>Logout</button>
					</div>
				) : (
					<div className='auth-container'>
						<Register onLogin={handleLogin} />
						<Login onLogin={handleLogin} />
						<GoogleSignIn onLogin={handleLogin} />
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
