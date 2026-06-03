import axios from 'axios';
import { showError } from './swalUtils';

// Base URL provided for the iCampus backend
const API_BASE_URL = 'https://tdtlworld.com/icampus-backend/api/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if online
    if (!navigator.onLine) {
      showError('Network Offline', 'Please check your internet connection.');
      return Promise.reject(new Error('Network Offline'));
    }

    // In a real app, retrieve the token from context/localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiration & Errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network timeout / offline
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      showError('Network Error', 'The request timed out or the server is unreachable.');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (Token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // Attempt to refresh the token
          const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
          
          if (res.data && res.data.access) {
            localStorage.setItem('access_token', res.data.access);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            
            // Re-attempt the original request
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        window.location.href = '/icampus/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
