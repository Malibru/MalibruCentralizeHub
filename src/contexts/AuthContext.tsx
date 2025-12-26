import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080';

  // Restaura sessão de usuário, se existir
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      const savedToken = localStorage.getItem('auth_token');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } else if (savedToken) {
        // Caso só tenha token salvo, considerar autenticado
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Usuarios/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, senha: password }),
        credentials: 'include'
      });

      if (!response.ok) {
        return {
          success: false,
          error: response.status === 401
            ? 'Credenciais inválidas'
            : 'Erro ao fazer login'
        };
      }

      const data = await response.json().catch(() => ({}));
      const autenticado = data?.autenticado ?? data?.isAutenticado ?? true;

      if (!autenticado) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      const usuario = data?.usuario ?? data?.user ?? {
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@malibru.com`
      };

      setUser(usuario);
      setIsAuthenticated(true);

      // Persiste sessão
      try {
        if (data?.token) localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(usuario));
      } catch {}

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Falha na comunicação com o servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
