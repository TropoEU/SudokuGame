import React, { useState } from 'react';
import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import '../Styles/Register.css';

interface RegisterProps {
	onLogin: (user: { username: string; level: number }) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				'http://localhost:3001/api/auth/register',
				{
					username,
					email,
					password,
				},
			);
			localStorage.setItem('token', response.data.token);
			onLogin(response.data.user);
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
