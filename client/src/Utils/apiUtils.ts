import axios from 'axios';

// Create an axios instance with a base URL
const apiUtils = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL
		? process.env.REACT_APP_API_BASE_URL + '/api'
		: '/api', // Use environment variable or default to '/api'
});

// Add a request interceptor to include the Authorization header
apiUtils.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Utility functions for making requests

export const get = (url: string, config = {}) => {
	return apiUtils.get(url, config);
};

export const post = (url: string, data: any, config = {}) => {
	return apiUtils.post(url, data, config);
};

export const put = (url: string, data: any, config = {}) => {
	return apiUtils.put(url, data, config);
};

export const del = (url: string, config = {}) => {
	return apiUtils.delete(url, config);
};

export default apiUtils;
