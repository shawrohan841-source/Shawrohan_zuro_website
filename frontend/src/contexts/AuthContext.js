import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(data);
    } catch (error) {
      // Silently set user to null on 401 (no console.error for unauthenticated state)
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
      setUser(data);
      return { success: true, user: data };
    } catch (error) {
      const detail = error.response?.data?.detail;
      let message = 'Login failed';
      if (typeof detail === 'string') message = detail;
      else if (Array.isArray(detail)) message = detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post(`${API}/auth/register`, { name, email, password, phone }, { withCredentials: true });
      setUser(data);
      return { success: true };
    } catch (error) {
      const detail = error.response?.data?.detail;
      let message = 'Registration failed';
      if (typeof detail === 'string') message = detail;
      else if (Array.isArray(detail)) message = detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear admin authentication on logout
      localStorage.removeItem('admin_authenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
