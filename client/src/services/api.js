import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('icareplus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('icareplus_token');
      localStorage.removeItem('icareplus_user');
      // If unauthorized on protected route, redirect to login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else if (window.location.pathname.startsWith('/patient')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject({ ...error, message });
  }
);

export default api;
