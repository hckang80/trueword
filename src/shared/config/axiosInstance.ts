import axios, { type AxiosError } from 'axios';
import type { ErrorResponse } from '../types';

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const { response } = error;

    console.error(response?.data.message);

    return Promise.reject(error);
  }
);
