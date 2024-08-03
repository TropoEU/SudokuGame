import React, { useState } from 'react';
import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import '../Styles/Login.css';
import endpoints from '../config';

interface LoginProps {
	onLogin: (user: { username: string; level: number }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await axios.post(endpoints.LOGIN, {
				email,
				password,
			});
			localStorage.setItem('token', response.data.token);
			onLogin(response.data.user);
			setMessage('Login successful');
		} catch (error) {
			setMessage(handleAxiosError(error));
		}
	};

	return (
		<div className='container'>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
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
				<button type='submit'>Login</button>
			</form>
			<p>{message}</p>
		</div>
	);
};

export default Login;
