import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserCog, Stethoscope, CalendarDays,
  CalendarCheck, Activity, FileText, ClipboardList, Receipt,
  CreditCard, Clock, BarChart3, Bot, Settings, LogOut, Menu, X, Smile
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/patients', label: 'Quản lý bệnh nhân', icon: Users },
    { path: '/admin/doctors', label: 'Quản lý bác sĩ', icon: UserCog },
    { path: '/admin/chairs', label: 'Ghế khám', icon: Stethoscope },
    { path: '/admin/schedules', label: 'Lịch làm việc', icon: CalendarDays },
    { path: '/admin/appointments', label: 'Lịch khám', icon: CalendarCheck },
    { path: '/admin/services', label: 'Dịch vụ nha khoa', icon: Activity },
    { path: '/admin/treatment-plans', label: 'Liệu trình điều trị', icon: ClipboardList },
    { path: '/admin/treatment-records', label: 'Hồ sơ điều trị', icon: FileText },
    { path: '/admin/invoices', label: 'Hóa đơn', icon: Receipt },
    { path: '/admin/payments', label: 'Thanh toán', icon: CreditCard },
    { path: '/admin/follow-ups', label: 'Lịch tái khám', icon: Clock },
    { path: '/admin/statistics', label: 'Thống kê', icon: BarChart3 },
    { path: '/admin/ai-assistant', label: 'AI Dental Assistant', icon: Bot },
    { path: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-sky-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Smile className="w-6 h-6 text-sky-300" />
          <span>Lucky Dental</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-sky-100 hover:text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 transform md:translate-x-0 md:static ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Clinic Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-900/40">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-base leading-tight">LUCKY DENTAL</h1>
            <p className="text-xs text-sky-400 font-medium">Hệ thống Quản trị</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center border border-sky-500/30">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName || user?.username}</p>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold uppercase">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-900/30'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 justify-between items-center sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Bảng Quản Trị Nha Khoa Lucky Dental</h2>
            <p className="text-xs text-slate-500">Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Hệ thống Hoạt động
            </span>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
