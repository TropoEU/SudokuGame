import React, { useState } from 'react';
import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import '../Styles/Register.css';
import endpoints from '../config';
import { BoardType } from '../Interfaces/types';

interface RegisterProps {
	onLogin: (
		user: { username: string; level: number },
		game: {
			initialBoard: BoardType;
			currentState: BoardType;
		},
	) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await axios.post(endpoints.REGISTER, {
				username,
				email,
				password,
			});
			localStorage.setItem('token', response.data.token);
			onLogin(response.data.user, response.data.game);
			setMessage('Registration successful');
		} catch (error) {
			setMessage(handleAxiosError(error));
		}
	};

	return (
		<div className='container'>
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Username</label>
					<input
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Email</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type='submit'>Register</button>
			</form>
			<p>{message}</p>
		</div>
	);
};

export default Register;
