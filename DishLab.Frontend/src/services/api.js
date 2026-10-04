import axios from 'axios';

// Skapa Axios-instans med grundläggande konfiguration
const api = axios.create({
  baseURL: 'http://localhost:5255/api', // Observera /api här eftersom dina controllers använder [Route("api/[controller]")]
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Bifoga Bearer-token på alla utgående anrop om den finns i localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Hantera utgångna tokens (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;