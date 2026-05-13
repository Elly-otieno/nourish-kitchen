import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  register: (data: any) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (newUser: User) => void;
  isAdmin: boolean;
  isChef: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * INITIALIZATION
   * On mount, check for a saved user and a token.
   * we fetch 'me' from the API 
   * to verify the token hasn't been blacklisted/expired.
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify session with backend
          const currentUser = await api.getMe();
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          console.error("Session expired or invalid");
          logout(); // Clear invalid data
        }
      }
      setInitialized(true);
    };

    initAuth();
  }, []);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      
      const userData = res.user;
      const accessToken = res.access;   
      const refreshToken = res.refresh; 

      setUser(userData);

      // Persist all data using consistent keys
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', accessToken); 
      localStorage.setItem('refresh_token', refreshToken);

      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      console.log('AUTH RES', res); 
      
      const userData = res.user;
      setUser(userData);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);

      // const userData = await api.getMe();
      // console.log('USER', userData);
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Optional: navigate to login here if not handled by a protected route wrapper
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