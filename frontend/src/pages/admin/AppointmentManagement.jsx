import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarCheck, Search, Filter, CheckCircle2, Clock, XCircle, AlertTriangle, User, Stethoscope } from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [chairs, setChairs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Status update modal state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedChairId, setSelectedChairId] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchMetadata();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments', { params: { status_filter: statusFilter } });
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [docRes, chairRes] = await Promise.all([api.get('/doctors'), api.get('/dental-chairs')]);
      setDoctors(docRes.data);
      setChairs(chairRes.data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const openStatusModal = (appt, status) => {
    setSelectedAppt(appt);
    setUpdateStatus(status);
    setSelectedDoctorId(appt.doctor_id || (doctors[0]?.id || ''));
    setSelectedChairId(appt.chair_id || (chairs[0]?.id || ''));
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${selectedAppt.id}/status`, {
        status: updateStatus,
        doctor_id: selectedDoctorId ? parseInt(selectedDoctorId) : null,
        chair_id: selectedChairId ? parseInt(selectedChairId) : null,
      });
      setSelectedAppt(null);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-sky-600" />
            Quản Lý Lịch Khám Bệnh
          </h2>
          <p className="text-xs text-slate-500">Tiếp nhận, xác nhận và phân bổ phòng / ghế khám cho bệnh nhân</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto gap-1">
        {[
          { id: '', label: 'Tất cả lịch đặt' },
          { id: 'Chờ xác nhận', label: 'Chờ xác nhận' },
          { id: 'Đã xác nhận', label: 'Đã xác nhận' },
          { id: 'Đã khám', label: 'Đã khám' },
          { id: 'Đã hủy', label: 'Đã hủy' },
          { id: 'Không đến', label: 'Không đến' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải lịch hẹn...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">Chưa có lịch hẹn nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã Hẹn</th>
                  <th className="p-4">Bệnh Nhân</th>
                  <th className="p-4">Dịch Vụ Khám</th>
                  <th className="p-4">Ngày & Giờ</th>
                  <th className="p-4">Bác Sĩ Phụ Trách</th>
                  <th className="p-4">Phòng / Ghế Khám</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Xử Lý Lịch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-sky-700 font-mono">{a.appointment_code}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{a.patient?.full_name}</p>
                      <p className="text-[11px] text-slate-500">{a.patient?.phone}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{a.service?.name}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{a.date}</p>
                      <p className="text-[11px] text-slate-500">{a.time_slot}</p>
                    </td>
                    <td className="p-4 text-slate-700">{a.doctor?.full_name || <span className="text-rose-500 italic">Chưa xếp</span>}</td>
                    <td className="p-4 text-slate-700">
                      {a.chair?.name ? (
                        <span className="font-semibold text-slate-800">{a.chair.name} ({a.chair.room})</span>
                      ) : (
                        <span className="text-amber-500 italic">Chưa xếp</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        a.status === 'Chờ xác nhận' ? 'bg-amber-100 text-amber-800' :
                        a.status === 'Đã xác nhận' ? 'bg-blue-100 text-blue-800' :
                        a.status === 'Đã khám' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {a.status === 'Chờ xác nhận' && (
                          <button
                            onClick={() => openStatusModal(a, 'Đã xác nhận')}
                            className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-[11px] shadow-sm shadow-sky-600/20"
                          >
                            Xác nhận
                          </button>
                        )}
                        {a.status === 'Đã xác nhận' && (
                          <button
                            onClick={() => openStatusModal(a, 'Đã khám')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Hoàn thành
                          </button>
                        )}
                        {['Chờ xác nhận', 'Đã xác nhận'].includes(a.status) && (
                          <button
                            onClick={() => openStatusModal(a, 'Đã hủy')}
                            className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-[11px]"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm / Assign Chair & Doctor Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full animate-fade-in border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Cập Nhật Trạng Thái Lịch Khám</h3>
            <p className="text-xs text-slate-500 mb-4">
              Mã hẹn: <strong className="text-sky-700 font-mono">{selectedAppt.appointment_code}</strong> | Bệnh nhân: {selectedAppt.patient?.full_name}
            </p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Trạng Thái Mới</label>
                <input
                  type="text"
                  value={updateStatus}
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-sky-800"
                />
              </div>

              {updateStatus === 'Đã xác nhận' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phân Công Bác Sĩ Phụ Trách (*)</label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                      required
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Xếp Phòng & Ghế Khám (*)</label>
                    <select
                      value={selectedChairId}
                      onChange={(e) => setSelectedChairId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                      required
                    >
                      <option value="">-- Chọn phòng & ghế khám --</option>
                      {chairs.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} - {c.room} (Trạng thái: {c.status})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setSelectedAppt(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                  Hủy
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md shadow-sky-600/20">
                  Cập Nhật Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
