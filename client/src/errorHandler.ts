// client/src/errorHandler.ts
import axios from 'axios';

interface AxiosErrorResponse {
	response?: {
		data: {
			error: string;
		};
	};
}

export const handleAxiosError = (error: any): string => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosErrorResponse;
		return axiosError.response?.data?.error || 'An unexpected error occurred';
	}
	return 'An unexpected error occurred';
};
