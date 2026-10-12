import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://dishlab-api-g0adafdvgfeqdean.norwayeast-01.azurewebsites.net').replace(/\/$/, '');

// För mina "vanliga" endpoints (/api/dishes osv)
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// För Identity-endpoints (/auth/login, /auth/register)
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
