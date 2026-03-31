import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ROOT_URL = API_BASE_URL.replace('/api', '');

export const api = axios.create({
    baseURL: API_BASE_URL,
});
