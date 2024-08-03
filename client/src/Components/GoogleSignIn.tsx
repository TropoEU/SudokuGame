import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import endpoints from '../config';

interface GoogleSignInProps {
	onLogin: (user: { username: string; level: number }) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onLogin }) => {
	const handleLogin = async (credentialResponse: any) => {
		try {
			const { credential } = credentialResponse;
			const response = await axios.post(endpoints.GOOGLE_SIGN_IN, {
				tokenId: credential,
			});
			localStorage.setItem('token', response.data.token);
			onLogin(response.data.user);
			// alert('Google Sign-In successful');
		} catch (error) {
			console.error('Error logging in with Google:', error);
			// alert('Google Sign-In failed');
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
