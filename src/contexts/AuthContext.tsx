import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  register: (data: any) => Promise<User>;
  login: (email: string) => Promise<User>;
  logout: () => void;
  updateUser: (newUser: User) => void;
  isAdmin: boolean;
  isChef: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  // In a real app, we'd check for a token in localStorage here
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setInitialized(true);
  }, []);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      const userData = res.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', res.token);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const login = async (email: string) => {
    try {
      const data = await api.login(email) as any;
      const userData = data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isChef = user?.role === 'CHEF' || user?.role === 'ADMIN';

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isAdmin, isChef, updateUser }}>
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
