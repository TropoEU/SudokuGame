const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const endpoints = {
	VERIFY_TOKEN: `${API_BASE_URL}/api/auth/verify-token`,
	REGISTER: `${API_BASE_URL}/api/auth/register`,
	LOGIN: `${API_BASE_URL}/api/auth/login`,
	GOOGLE_SIGN_IN: `${API_BASE_URL}/api/auth/google`,
	SAVE_GAME: `${API_BASE_URL}/api/game/save`,
	CHECK_GAME: `${API_BASE_URL}/api/game/check`,
};

export default endpoints;
