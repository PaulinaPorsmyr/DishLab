import { useState } from 'react';
import { AuthContext } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5255';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    return savedEmail ? { email: savedEmail } : null;
  });

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login?useCookies=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { success: false, message: 'Inloggningen misslyckades. Kontrollera e-post och lösenord.' };
      }

      setUser({ email });
      localStorage.setItem('userEmail', email);
      return { success: true };
    } catch (err) {
      console.error('Inloggningsfel:', err);
      return { success: false, message: 'Kunde inte ansluta till servern.' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMsg = 'Registreringen misslyckades.';
        
        if (errorData?.errors) {
          errorMsg = Object.values(errorData.errors)[0]?.[0] || errorMsg;
        }

        return { success: false, message: errorMsg };
      }

      return await login(email, password);
    } catch (err) {
      console.error('Registreringsfel:', err);
      return { success: false, message: 'Kunde inte ansluta till servern.' };
    }
  };

  const logout = async () => {
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