import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import GoogleSignIn from './Components/GoogleSignIn';
import { Board } from './Components/Board';
import endpoints from './config';
import { post } from './Utils/apiUtils';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<{ username: string; level: number } | null>(
		null,
	);

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const response = await post(endpoints.VERIFY_TOKEN, {});
				if (response.data.valid) {
					setIsLoggedIn(true);
					setUser(response.data.user);
				} else {
					setIsLoggedIn(false);
					setUser(null);
					localStorage.removeItem('token');
					localStorage.removeItem('user');
				}
			} catch (error) {
				setIsLoggedIn(false);
				setUser(null);
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
		};

		if (localStorage.getItem('token')) {
			verifyToken();
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
