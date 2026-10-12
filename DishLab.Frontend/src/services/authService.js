import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login?useCookies=true', credentials);
  localStorage.setItem('userEmail', credentials.email);
  return response.data;
};

export const register = async (userData) => {
  await api.post('/auth/register', userData);
  return await login(userData);
};

export const logout = () => {
  localStorage.removeItem('userEmail');
};
