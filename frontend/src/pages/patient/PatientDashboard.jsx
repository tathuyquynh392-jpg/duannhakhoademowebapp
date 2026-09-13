import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Calendar, Clock, Activity, Receipt, ArrowRight, CalendarPlus, Sparkles, ShieldCheck } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientOverview();
  }, []);

  const fetchPatientOverview = async () => {
    try {
      setLoading(true);
      const [appRes, planRes, invRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/treatment-plans'),
        api.get('/invoices')
      ]);
      setAppointments(appRes.data);
      setTreatmentPlans(planRes.data);
      setInvoices(invRes.data);
    } catch (err) {
      console.error('Error fetching patient overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextAppointment = appointments.find(a => ['Chờ xác nhận', 'Đã xác nhận'].includes(a.status));
  const activePlan = treatmentPlans.find(p => p.status === 'Đang điều trị');
  const unpaidInvoice = invoices.find(i => i.remaining_amount > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-teal-500/30 text-teal-200 rounded-full text-xs font-bold mb-3 border border-teal-400/30">
            Trang Chủ Bệnh Nhân
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Xin chào, {user?.fullName || 'Bệnh nhân'}!</h1>
          <p className="text-teal-100 text-xs md:text-sm leading-relaxed mb-6">
            Cảm ơn bạn đã lựa chọn phòng khám Lucky Dental. Hãy kiểm tra thông tin lịch khám và chăm sóc sức khỏe nụ cười hôm nay!
          </p>
          <Link
            to="/patient/book"
            className="inline-flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all"
          >
            <CalendarPlus className="w-4 h-4 text-teal-600" />
            Đặt Lịch Khám Ngay
          </Link>
        </div>
        <div className="absolute right-6 -bottom-10 opacity-15 pointer-events-none hidden md:block">
          <Sparkles className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Next Appointment Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xs text-slate-500">LỊCH KHÁM GẦN NHẤT</span>
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            {nextAppointment ? (
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{nextAppointment.service?.name}</h3>
                <p className="text-xs font-bold text-teal-700">{nextAppointment.date} lúc {nextAppointment.time_slot}</p>
                <p className="text-xs text-slate-500">Bác sĩ: {nextAppointment.doctor?.full_name || 'Đang cập nhật'}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {nextAppointment.status}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Bạn chưa có lịch khám sắp tới</p>
            )}
          </div>
          <Link to="/patient/appointments" className="mt-4 text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline">
            Xem lịch khám <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Treatment Progress Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xs text-slate-500">TIẾN ĐỘ ĐIỀU TRỊ</span>
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            {activePlan ? (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm truncate">{activePlan.plan_name}</h3>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Hoàn thành</span>
                    <span>{activePlan.progress_percent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${activePlan.progress_percent}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Không có liệu trình điều trị đang diễn ra</p>
            )}
          </div>
          <Link to="/patient/treatments" className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
            Xem liệu trình <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Unpaid Invoice Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xs text-slate-500">HÓA ĐƠN CẦN THANH TOÁN</span>
              <Receipt className="w-5 h-5 text-rose-600" />
            </div>
            {unpaidInvoice ? (
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Hóa đơn {unpaidInvoice.invoice_code}</h3>
                <p className="text-lg font-black text-rose-600">{unpaidInvoice.remaining_amount.toLocaleString('vi-VN')}đ</p>
                <span className="inline-block px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold">
                  {unpaidInvoice.status}
                </span>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bạn không có hóa đơn nợ
              </p>
            )}
          </div>
          <Link to="/patient/invoices" className="mt-4 text-xs font-bold text-rose-600 flex items-center gap-1 hover:underline">
            Xem chi tiết hóa đơn <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
