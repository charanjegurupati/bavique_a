import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bavique_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.getMe();
          const currentUser = res.user || res.data;
          if (res.success && currentUser) {
            setUser(currentUser);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          handleLogout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const handleLogin = async (email, password) => {
    const res = await api.loginAdmin({ email, password });
    const currentUser = res.user || res.data;
    if (res.success && res.token && currentUser) {
      localStorage.setItem('bavique_admin_token', res.token);
      setToken(res.token);
      setUser(currentUser);
      return currentUser;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await api.logoutAdmin().catch(() => {});
      }
    } finally {
      localStorage.removeItem('bavique_admin_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
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
