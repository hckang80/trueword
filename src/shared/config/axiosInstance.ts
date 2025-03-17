import axios, { type AxiosError } from 'axios';
import { getOrigin, type ErrorResponse } from '..';

export const axiosInstance = axios.create({
  baseURL: await getOrigin(),
  timeout: 5000
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
