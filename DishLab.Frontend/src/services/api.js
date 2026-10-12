import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dishlab-api-g0adafdvgfeqdean.norwayeast-01.azurewebsites.net';

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, '')}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
