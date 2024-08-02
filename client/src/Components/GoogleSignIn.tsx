// src/Components/GoogleSignIn.tsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleSignIn: React.FC = () => {
	const handleLogin = async (credentialResponse: any) => {
		try {
			const { credential } = credentialResponse;
			const response = await axios.post(
				'http://localhost:3001/api/auth/google',
				{
					tokenId: credential,
				},
			);
			console.log('Server response:', response.data);
			// Handle the response as needed
		} catch (error) {
			console.error('Error logging in with Google:', error);
		}
	};

	return (
		<div>
			<GoogleLogin
				onSuccess={handleLogin}
				onError={() => console.log('Login error')}
			/>
		</div>
	);
};

export default GoogleSignIn;
