import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    return savedEmail ? { email: savedEmail } : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5255/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { success: false, message: 'Inloggningen misslyckades. Kontrollera e-post och lösenord.' };
      }

      const data = await response.json();
      setToken(data.accessToken);
      setUser({ email });
      localStorage.setItem('userEmail', email); // 👈 Spara e-posten
      return { success: true };
    } catch (err) {
      console.error('Inloggningsfel:', err);
      return { success: false, message: 'Kunde inte ansluta till servern.' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5255/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userEmail'); // 👈 Rensa vid utloggning
  };

  return (
    <AuthContext.Provider value={{ token, user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}