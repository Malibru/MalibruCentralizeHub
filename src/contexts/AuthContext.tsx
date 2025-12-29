import { createContext, useContext, useState } from 'react';
import { loginRequest } from '../services/AuthServices';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(login, senha) {
    try {
      const resp = await loginRequest(login, senha);

      if (!resp.autenticado || !resp.token) {
        return { success: false, error: resp.mensagem };
      }

      localStorage.setItem('auth_token', resp.token);

      localStorage.setItem('auth_user', JSON.stringify(resp));

      setUser(resp);

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }

  function isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
