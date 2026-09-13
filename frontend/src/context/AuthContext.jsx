import React, { createContext, useContext, useState } from 'react';
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
    const u = (username || '').trim();
    const p = (password || '').trim();

    const isGitHubPages = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      window.location.hostname === 'tathuyquynh392-jpg.github.io'
    );

    try {
      // 1. Direct Demo Login check on GitHub Pages (NO API HTTP REQUEST MADE)
      if (isGitHubPages) {
        if (u === 'admin' && p === 'admin123') {
          const demoAdmin = {
            userId: 1,
            username: 'admin',
            fullName: 'Quản trị viên Hệ thống (Demo)',
            role: 'ADMIN',
            patientId: null
          };
          const demoToken = 'demo_admin_token_' + Date.now();
          localStorage.setItem('lucky_token', demoToken);
          localStorage.setItem('lucky_user', JSON.stringify(demoAdmin));
          setToken(demoToken);
          setUser(demoAdmin);
          return demoAdmin;
        }

        if ((u === 'patient01' || u === 'patient1' || u === 'patient02' || u === 'patient03' || u.startsWith('patient')) && p === 'patient123') {
          const demoPatient = {
            userId: 2,
            username: u,
            fullName: u === 'patient02' ? 'Trần Thị Bích' : (u === 'patient03' ? 'Lê Hoàng Cường' : 'Nguyễn Văn An'),
            role: 'PATIENT',
            patientId: 1
          };
          const demoToken = 'demo_patient_token_' + Date.now();
          localStorage.setItem('lucky_token', demoToken);
          localStorage.setItem('lucky_user', JSON.stringify(demoPatient));
          setToken(demoToken);
          setUser(demoPatient);
          return demoPatient;
        }

        throw 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      }

      // 2. Real FastAPI backend API call for Localhost
      const response = await api.post('/auth/login', { username: u, password: p });
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
      if (typeof err === 'string') throw err;
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
