import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: 'An unexpected error occurred',
      status: 500,
      data: null,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      customError.status = error.response.status;
      customError.message = error.response.data?.error?.message || error.message;
      customError.data = error.response.data;

      // Handle 401 Unauthorized globally (e.g., redirect to login)
      if (customError.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      customError.message = 'Network Error - could not connect to server';
    }

    return Promise.reject(customError);
  }
);
