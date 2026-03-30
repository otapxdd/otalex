import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Cookies.get('__otalex_auth') === 'true';
  });
  
  const [user, setUser] = useState<any>(() => {
    const raw = Cookies.get('__otalex_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Define o cookie para expirar em 7 dias (ajustável)
    Cookies.set('__otalex_auth', 'true', { expires: 7, secure: true, sameSite: 'strict' });
    Cookies.set('__otalex_user', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'strict' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove('__otalex_auth');
    Cookies.remove('__otalex_user');
  };

  useEffect(() => {
    // Limpa o localStorage antigo caso ainda existam dados lá
    localStorage.removeItem('__otalex_auth');
    localStorage.removeItem('__otalex_user');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
