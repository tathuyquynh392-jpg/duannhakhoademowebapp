import axios from 'axios';
import {
  DEMO_PATIENTS,
  DEMO_DOCTORS,
  DEMO_CHAIRS,
  DEMO_SERVICES,
  DEMO_SCHEDULES,
  DEMO_STATISTICS,
  DEMO_TREATMENT_PLANS
} from './demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lucky_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: fallback to demo data if backend is offline or on GitHub Pages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;

    // Check if network error or 404/500 occurs (e.g. backend server offline on GitHub Pages)
    if (isGitHubPages || !error.response || error.response.status === 404 || error.code === 'ERR_NETWORK') {
      const url = config.url || '';
      const method = (config.method || 'get').toLowerCase();

      // Return mock response helper
      const mockOk = (data) => Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config });

      // Handle Authentication demo login fallback
      if (url.includes('/auth/login') && method === 'post') {
        let body = {};
        try {
          body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
        } catch (e) {
          body = {};
        }

        const username = (body.username || '').trim();
        const password = (body.password || '').trim();

        if (username === 'admin' && password === 'admin123') {
          return mockOk({
            access_token: 'demo_admin_token',
            token_type: 'bearer',
            user_id: 1,
            username: 'admin',
            full_name: 'Quản trị viên Hệ thống (Demo)',
            role: 'ADMIN',
            patient_id: null
          });
        }

        if ((username === 'patient01' || username === 'patient1' || username === 'patient02' || username === 'patient03' || username.startsWith('patient')) && password === 'patient123') {
          return mockOk({
            access_token: 'demo_patient_token',
            token_type: 'bearer',
            user_id: 2,
            username: username,
            full_name: username === 'patient02' ? 'Trần Thị Bích' : (username === 'patient03' ? 'Lê Hoàng Cường' : 'Nguyễn Văn An'),
            role: 'PATIENT',
            patient_id: 1
          });
        }

        return Promise.reject({
          response: {
            status: 401,
            data: { detail: 'Đăng nhập thất bại. Tên đăng nhập hoặc mật khẩu không chính xác.' }
          }
        });
      }

      // Handle GET endpoints in Demo Mode
      if (method === 'get') {
        if (url.includes('/patients')) return mockOk(DEMO_PATIENTS);
        if (url.includes('/doctors')) return mockOk(DEMO_DOCTORS);
        if (url.includes('/dental-chairs')) return mockOk(DEMO_CHAIRS);
        if (url.includes('/services')) return mockOk(DEMO_SERVICES);
        if (url.includes('/schedules')) return mockOk(DEMO_SCHEDULES);
        if (url.includes('/treatment-plans')) return mockOk(DEMO_TREATMENT_PLANS);
        if (url.includes('/statistics')) return mockOk(DEMO_STATISTICS);
        if (url.includes('/invoices')) return mockOk([]);
        if (url.includes('/payments')) return mockOk([]);
        if (url.includes('/follow-ups')) return mockOk([]);
      }

      // Handle POST / PUT / DELETE mock success in Demo Mode
      if (method === 'post' || method === 'put' || method === 'delete') {
        if (url.includes('/ai/chat')) {
          return mockOk({ response: 'Dạ xin chào! Tôi là Trợ lý AI Nha khoa Lucky Dental (Demo Mode). Hệ thống của chúng tôi mở cửa từ 08:00 - 20:00 hàng ngày. Bạn cần tư vấn về dịch vụ tẩy trắng, niềng răng hay đặt lịch khám ạ?' });
        }
        return mockOk({ message: 'Thao tác demo thành công', id: Date.now() });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
