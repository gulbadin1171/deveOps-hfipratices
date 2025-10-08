// src/context/auth-context.tsx
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');

  const login = (email: string, password: string) => {
    // TODO: Add proper authentication logic here
    // For now, we'll just validate that both fields exist
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    setIsAuthenticated(true);
    setEmail(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
