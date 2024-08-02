// src/components/GoogleSignIn.tsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignIn: React.FC = () => {
	const handleLoginSuccess = (response: any) => {
		console.log('Login successful:', response);
		// You can use the response to obtain user data or send it to your server
	};

	const handleLoginError = () => {
		console.error('Login failed');
		// Handle the error appropriately
	};

	return (
		<div>
			<GoogleLogin
				onSuccess={handleLoginSuccess}
				onError={handleLoginError} // Adjusted to match the expected type
				// You may need to provide additional props based on the library's documentation
			/>
		</div>
	);
};

export default GoogleSignIn;
