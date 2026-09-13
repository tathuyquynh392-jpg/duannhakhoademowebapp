import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lucky_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('lucky_token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    const isGitHubPages = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      window.location.hostname === 'tathuyquynh392-jpg.github.io' ||
      window.location.href.includes('github.io')
    );

    // 1. DEMO AUTHENTICATION FOR ADMIN
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
      setLoading(false);
      return demoAdmin;
    }

    // 2. DEMO AUTHENTICATION FOR PATIENT
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
      setLoading(false);
      return demoPatient;
    }

    // 3. IF ON GITHUB PAGES & NOT DEMO CREDENTIALS -> THROW CLEAR ERROR
    if (isGitHubPages) {
      setLoading(false);
      throw 'Đăng nhập thất bại. Tên đăng nhập hoặc mật khẩu không chính xác.';
    }

    // 4. IF ON LOCALHOST -> CALL REAL FASTAPI BACKEND
    try {
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
