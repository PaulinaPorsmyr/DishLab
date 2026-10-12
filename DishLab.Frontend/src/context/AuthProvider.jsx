import { useState } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    return savedEmail ? { email: savedEmail } : null;
  });

  const login = async (email, password) => {
    try {
      await api.post('/auth/login?useCookies=true', { email, password });

      setUser({ email });
      localStorage.setItem('userEmail', email);
      return { success: true };
    } catch (err) {
      console.error('Inloggningsfel:', err);
      const message = err.response?.data?.title || 'Inloggningen misslyckades. Kontrollera e-post och lösenord.';
      return { success: false, message };
    }
  };

  const register = async (email, password) => {
    try {
      await api.post('/auth/register', { email, password });
      return await login(email, password);
    } catch (err) {
      console.error('Registreringsfel:', err);
      let errorMsg = 'Registreringen misslyckades.';
      const errorData = err.response?.data;

      if (errorData?.errors) {
        errorMsg = Object.values(errorData.errors)[0]?.[0] || errorMsg;
      }

      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
