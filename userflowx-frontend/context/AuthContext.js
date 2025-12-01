'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage and cookies
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = Cookies.get('token');

      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error('Failed to parse saved user:', err);
          localStorage.removeItem('user');
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.register({ name, email, password });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      const response = await authAPI.verifyEmail(token);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Email verification failed';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authAPI.forgotPassword({ email });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (token, password, confirmPassword) => {
    try {
      setError(null);
      const response = await authAPI.resetPassword(token, {
        password,
        confirmPassword,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Password reset failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      Cookies.remove('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        verifyEmail,
        login,
        forgotPassword,
        resetPassword,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
