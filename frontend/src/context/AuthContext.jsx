import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lucky_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lucky_token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const data = response.data;
      
      const userData = {
        userId: data.user_id,
        username: data.username,
        fullName: data.full_name,
        role: data.role,
        patientId: data.patient_id
      };

      localStorage.setItem('lucky_token', data.access_token);
      localStorage.setItem('lucky_user', JSON.stringify(userData));
      
      setToken(data.access_token);
      setUser(userData);
      return userData;
    } catch (err) {
      throw err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lucky_token');
    localStorage.removeItem('lucky_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
