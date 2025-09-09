import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authApi } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {
  const url = "https://student-backend-02ye.onrender.com"
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await authApi.verifyToken(token);
      setUser(response.user);
    } catch (error) {
      localStorage.removeItem('token');
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(email, password);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return true;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'admin' | 'student'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.signup(name, email, password, role);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return true;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
