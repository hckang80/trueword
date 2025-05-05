import axios, { type AxiosError } from 'axios';
import type { ErrorResponse } from '..';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_SITE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
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
