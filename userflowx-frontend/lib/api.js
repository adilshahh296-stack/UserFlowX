import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh or logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email?token=${token}`),
  login: (data) => apiClient.post('/auth/login', data),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (token, data) =>
    apiClient.post(`/auth/reset-password?token=${token}`, data),
  logout: () => apiClient.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  getAllUsers: (page = 1, limit = 10) =>
    apiClient.get(`/users/all?page=${page}&limit=${limit}`),
  updateUserRole: (userId, role) =>
    apiClient.put(`/users/${userId}/role`, { role }),
  deleteUser: (userId) => apiClient.delete(`/users/${userId}`),
};

export default apiClient;
