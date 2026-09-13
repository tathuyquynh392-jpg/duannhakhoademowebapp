import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, UserCog, CalendarCheck, Clock, DollarSign, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/statistics');
      setStats(res.data);
    } catch (err) {
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpi = stats?.kpi || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">BỆNH NHÂN</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{kpi.total_patients || 0}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">Tổng đăng ký</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">BÁC SĨ</span>
            <UserCog className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{kpi.total_doctors || 0}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1">Đang làm việc</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">LỊCH HÔM NAY</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{kpi.today_appointments || 0}</p>
          <span className="text-[10px] text-indigo-600 font-bold mt-1">Lịch khám</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">TÁI KHÁM</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{kpi.today_followups || 0}</p>
          <span className="text-[10px] text-amber-600 font-bold mt-1">Hôm nay</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">DOANH THU NGÀY</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-emerald-600">{(kpi.today_revenue || 0).toLocaleString('vi-VN')}đ</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Thực thu</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">DOANH THU THÁNG</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-lg font-black text-sky-700">{(kpi.monthly_revenue || 0).toLocaleString('vi-VN')}đ</p>
          <span className="text-[10px] text-sky-600 font-bold mt-1">Tháng hiện tại</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold">NỢ CHƯA THU</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600">{kpi.unpaid_invoices_count || 0}</p>
          <span className="text-[10px] text-rose-500 font-bold mt-1">Hóa đơn</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Biểu Đồ Doanh Thu (VNĐ)</h3>
              <p className="text-xs text-slate-500">Thống kê tổng thu theo tháng</p>
            </div>
            <span className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-bold">2026</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.revenue_chart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip formatter={(val) => [`${val.toLocaleString('vi-VN')} đ`, 'Doanh Thu']} />
                <Line type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Visits Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Lượt Bệnh Nhân Khám</h3>
              <p className="text-xs text-slate-500">Số lượt khám thực tế theo tháng</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Lượt khám</span>
          </div>
          <div className="h-64">
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

      {/* Top Services Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4">Top Dịch Vụ Nha Khoa Được Sử Dụng Nhiều Nhất</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="pb-3">Tên Dịch Vụ</th>
                <th className="pb-3 text-center">Số Lượt</th>
                <th className="pb-3 text-right">Doanh Thu Dự Kiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(stats?.top_services || []).map((srv, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    {srv.name}
                  </td>
                  <td className="py-3 text-center text-slate-600 font-bold">{srv.count} lượt</td>
                  <td className="py-3 text-right font-black text-sky-700">{srv.revenue.toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
