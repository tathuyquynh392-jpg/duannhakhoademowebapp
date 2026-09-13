import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3, TrendingUp, Users, CalendarCheck, Sparkles, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/statistics');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Đang tổng hợp báo cáo thống kê...</div>;
  }

  const kpi = stats?.kpi || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-teal-600" />
          Báo Cáo & Thống Kê Chuyên Sâu
        </h2>
        <p className="text-xs text-slate-500">Phân tích hiệu quả kinh doanh, lượt khám và xu hướng dịch vụ phòng khám</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Tổng Số Bệnh Nhân</span>
          <p className="text-3xl font-black text-slate-900">{kpi.total_patients || 0}</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 inline-block">Bệnh nhân đăng ký</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Lượt Khám Hôm Nay</span>
          <p className="text-3xl font-black text-indigo-600">{kpi.today_appointments || 0}</p>
          <span className="text-xs text-indigo-600 font-bold mt-2 inline-block">Lịch hẹn</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Doanh Thu Hôm Nay</span>
          <p className="text-2xl font-black text-emerald-600">{(kpi.today_revenue || 0).toLocaleString('vi-VN')}đ</p>
          <span className="text-xs text-slate-400 mt-2 inline-block">Thực thu</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Doanh Thu Tháng Này</span>
          <p className="text-2xl font-black text-teal-700">{(kpi.monthly_revenue || 0).toLocaleString('vi-VN')}đ</p>
          <span className="text-xs text-teal-600 font-bold mt-2 inline-block">Tháng 9/2026</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-6">Xu Hướng Doanh Thu Theo Tháng (VNĐ)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.revenue_chart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip formatter={(val) => [`${val.toLocaleString('vi-VN')} đ`, 'Doanh thu']} />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-6">Thống Kê Số Lượt Bệnh Nhân Khám</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.visits_chart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip formatter={(val) => [`${val} lượt`, 'Lượt khám']} />
                <Bar dataKey="visits" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
