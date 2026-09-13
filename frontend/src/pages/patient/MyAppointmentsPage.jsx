import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarCheck, Calendar, Clock, X, AlertTriangle, RefreshCw } from 'lucide-react';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule Modal State
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('09:00');

  // Cancel Modal State
  const [cancelAppt, setCancelAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching my appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${rescheduleAppt.id}/reschedule`, {
        date: newDate,
        time_slot: newTimeSlot
      });
      alert('Đổi lịch thành công! Trạng thái chuyển về [Chờ xác nhận].');
      setRescheduleAppt(null);
      fetchMyAppointments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể đổi lịch');
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${cancelAppt.id}/cancel`, {
        cancel_reason: cancelReason
      });
      alert('Hủy lịch hẹn thành công!');
      setCancelAppt(null);
      fetchMyAppointments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể hủy lịch');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-teal-600" />
          Lịch Khám Của Tôi
        </h2>
        <p className="text-xs text-slate-500">Danh sách các lịch hẹn đã đặt tại Lucky Dental</p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải danh sách lịch hẹn...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Bạn chưa có lịch hẹn nào.
          </div>
        ) : (
          appointments.map((a) => (
            <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 mb-1 inline-block">
                    {a.appointment_code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{a.service?.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  a.status === 'Chờ xác nhận' ? 'bg-amber-100 text-amber-800' :
                  a.status === 'Đã xác nhận' ? 'bg-indigo-100 text-indigo-800' :
                  a.status === 'Đã khám' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {a.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Ngày: <strong className="text-slate-900">{a.date}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Giờ: <strong className="text-slate-900">{a.time_slot}</strong></span>
                </div>
                <div>
                  <span>Bác sĩ phụ trách: <strong className="text-slate-900">{a.doctor?.full_name || 'Đang xếp'}</strong></span>
                </div>
              </div>

              {a.notes && <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl">Ghi chú: {a.notes}</p>}
              {a.cancel_reason && <p className="text-xs text-rose-600 italic bg-rose-50 p-3 rounded-xl">Lý do hủy: {a.cancel_reason}</p>}

              {['Chờ xác nhận', 'Đã xác nhận'].includes(a.status) && (
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 text-xs">
                  <button
                    onClick={() => { setRescheduleAppt(a); setNewDate(a.date); setNewTimeSlot(a.time_slot); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600" /> Đổi lịch hẹn
                  </button>
                  <button
                    onClick={() => { setCancelAppt(a); setCancelReason(''); }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-all"
                  >
                    Hủy lịch hẹn
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full animate-fade-in border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Đổi Lịch Hẹn Khám</h3>
            <p className="text-xs text-slate-500 mb-4">Mã hẹn: {rescheduleAppt.appointment_code}</p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ngày Khám Mới</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Khung Giờ Mới</label>
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="09:00"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setRescheduleAppt(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">
                  Hủy bỏ
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md">
                  Xác Nhận Đổi Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirm Dialog */}
      {cancelAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full animate-fade-in border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2 text-rose-600">Xác Nhận Hủy Lịch Hẹn</h3>
            <p className="text-xs text-slate-500 mb-4">Bạn có chắc chắn muốn hủy lịch khám mã <strong>{cancelAppt.appointment_code}</strong>?</p>

            <form onSubmit={handleCancelSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nhập lý do hủy (Nếu có)</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ví dụ: Có việc bận đột xuất..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setCancelAppt(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">
                  Quay lại
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md">
                  Xác Nhận Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
