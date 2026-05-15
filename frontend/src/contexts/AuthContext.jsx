import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (localStorage.getItem('token')) {
      try {
        const res = await api.get('/auth/me');
        setAdmin(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    
    localStorage.setItem('token', res.data.token);
    const userData = res.data.admin;
    localStorage.setItem('admin', JSON.stringify(userData));
    
    setAdmin(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
