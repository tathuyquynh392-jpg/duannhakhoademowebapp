import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smile, Lock, User, ShieldAlert, ArrowLeft, KeyRound, Info, Copy } from 'lucide-react';

const LoginPage = () => {
  const [roleMode, setRoleMode] = useState('PATIENT'); // 'ADMIN' or 'PATIENT'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (mode) => {
    setRoleMode(mode);
    setError('');
    // Strictly CLEAR inputs when switching mode (DO NOT AUTO-FILL)
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(username.trim(), password.trim());
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (u, p, mode) => {
    setRoleMode(mode);
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5 border border-slate-200">
        
        {/* Left Form Area (3 Cols) */}
        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
                <Smile className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">LUCKY DENTAL</h1>
                <p className="text-xs font-semibold text-sky-600 uppercase">Hệ thống Quản lý Nha khoa</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">Đăng Nhập Tài Khoản</h2>
            <p className="text-xs text-slate-500 mb-6">Vui lòng chọn loại tài khoản và nhập thông tin đăng nhập của bạn.</p>

            {/* Role Switcher Tabs */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-6 border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  roleMode === 'ADMIN'
                    ? 'bg-white text-sky-800 shadow-md border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [ ADMIN ]
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('PATIENT')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  roleMode === 'PATIENT'
                    ? 'bg-white text-sky-800 shadow-md border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [ PATIENT ]
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên đăng nhập / Email ({roleMode})
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={roleMode === 'ADMIN' ? 'Nhập tài khoản Admin' : 'Nhập tài khoản Patient của bạn'}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-sky-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-sky-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Đăng nhập {roleMode}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-4">
            <p className="text-[11px] text-slate-400">
              Bệnh nhân chưa có tài khoản? Vui lòng liên hệ lễ tân Lucky Dental để tạo hồ sơ.
            </p>
          </div>
        </div>

        {/* Right Info Sidebar (2 Cols) */}
        <div className="md:col-span-2 bg-slate-900 text-white p-8 flex flex-col justify-between border-l border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-4">
              <Info className="w-4 h-4" />
              <span>TÀI KHOẢN DEMO KIỂM THỬ</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Thông tin tài khoản kiểm thử hệ thống. Bấm vào tài khoản bên dưới để tự động điền nhanh:
            </p>

            <div className="space-y-3">
              <div
                onClick={() => fillDemoAccount('admin', 'admin123', 'ADMIN')}
                className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-sky-400">ADMINISTRATOR</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">ADMIN</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">user: admin | pass: admin123</p>
              </div>

              <div
                onClick={() => fillDemoAccount('patient01', 'patient123', 'PATIENT')}
                className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-sky-400">PATIENT 1 (Nguyễn Văn An)</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold">PATIENT</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">user: patient01 | pass: patient123</p>
              </div>

              <div
                onClick={() => fillDemoAccount('patient02', 'patient123', 'PATIENT')}
                className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-sky-400">PATIENT 2 (Trần Thị Bích)</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold">PATIENT</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">user: patient02 | pass: patient123</p>
              </div>

              <div
                onClick={() => fillDemoAccount('patient03', 'patient123', 'PATIENT')}
                className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-sky-400">PATIENT 3 (Lê Hoàng Cường)</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold">PATIENT</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">user: patient03 | pass: patient123</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-slate-500">
            Mỗi tài khoản Patient có quyền hạn độc lập, chỉ được xem và quản lý hồ sơ khám của chính mình.
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
