import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Shared Axios instance for REST calls to the chat backend.
 * Ready for Kafka-backed AI services behind the same API surface.
 */
const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
    };

    if (error.response?.status === 401) {
      // Hook for auth refresh / redirect when backend is wired
      console.warn('[API] Unauthorized request');
    }

    return Promise.reject(normalized);
  }
);

export { apiClient, API_ENDPOINTS };
export default apiClient;
