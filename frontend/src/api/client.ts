import axios, { AxiosError } from 'axios';
import { clearAuth, getToken } from '../auth/authStorage';

export const AUTH_UNAUTHORIZED_EVENT = 'codementor:auth-unauthorized';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return 'Unable to reach the server. Check that the backend is running.';
  }

  const status = error.response.status;
  const responseData = error.response.data;
  if (typeof responseData === 'object' && responseData !== null) {
    const message = 'message' in responseData && typeof responseData.message === 'string'
      ? responseData.message
      : 'error' in responseData && typeof responseData.error === 'string'
        ? responseData.error
        : null;
    if (message) {
      return message;
    }
  }

  if (status === 400) {
    return 'The submitted information is invalid.';
  }
  if (status === 401) {
    return 'Your session has expired. Please sign in again.';
  }
  if (status === 404) {
    return 'The requested resource was not found.';
  }
  if (status >= 500) {
    return 'The server could not complete the request. Please try again.';
  }

  return fallback;
}

export default apiClient;
