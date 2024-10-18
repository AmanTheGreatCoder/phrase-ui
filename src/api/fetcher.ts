import axios from 'axios';

export const af = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api/v1',
	withCredentials: true,
});
