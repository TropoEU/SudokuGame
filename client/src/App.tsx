import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import GoogleSignIn from './Components/GoogleSignIn';
import { Board } from './Components/Board';
import axios from 'axios';
import endpoints from './config';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<{ username: string; level: number } | null>(
		null,
	);

	useEffect(() => {
		const verifyToken = async (token: string) => {
			try {
				const response = await axios.post(endpoints.VERIFY_TOKEN, { token });
				if (response.data.valid) {
					setIsLoggedIn(true);
					setUser(response.data.user);
				} else {
					localStorage.removeItem('token');
				}
			} catch (error) {
				localStorage.removeItem('token');
			}
		};

		const token = localStorage.getItem('token');
		if (token) {
			verifyToken(token);
		}
	}, []);

	const handleLogin = (user: { username: string; level: number }) => {
		setIsLoggedIn(true);
		setUser(user);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
		setUser(null);
	};

	return (
		<div className='App'>
			<header className='App-header'>
				<h1>Sudoku Game</h1>
				{isLoggedIn ? (
					<div>
						<p>Welcome, {user?.username}!</p>
						<p>Level: {user?.level}</p>
						<Board />
						<br />
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
