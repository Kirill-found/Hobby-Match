import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
// Base URL without /api/v1 for static files
const BASE_URL = API_URL.replace('/api/v1', '');

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get full photo URL
export const getPhotoUrl = (photoPath: string): string => {
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath; // Already full URL
  }
  return `${BASE_URL}${photoPath}`; // /uploads/photos/... -> http://localhost:8000/uploads/photos/...
};

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('[API Client] Making request to:', config.url);
  console.log('[API Client] Token found:', token ? 'Yes' : 'No');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API Client] Authorization header set');
  } else {
    console.warn('[API Client] No token found in localStorage');
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
