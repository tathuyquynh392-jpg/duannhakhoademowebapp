import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarCheck, Plus, CheckCircle, ShieldAlert, X } from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [chairs, setChairs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Status update modal state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedChairId, setSelectedChairId] = useState('');

  // Create new appointment modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    patient_id: '',
    doctor_id: '',
    chair_id: '',
    service_id: '',
    date: new Date().toISOString().split('T')[0],
    time_slot: '09:00',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

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
      const [patRes, docRes, srvRes, chairRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/services'),
        api.get('/dental-chairs')
      ]);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setServices(srvRes.data);
      setChairs(chairRes.data);

      if (patRes.data.length > 0 && srvRes.data.length > 0) {
        setCreateData(prev => ({
          ...prev,
          patient_id: patRes.data[0].id,
          doctor_id: docRes.data[0]?.id || '',
          chair_id: chairRes.data[0]?.id || '',
          service_id: srvRes.data[0].id
        }));
      }
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
      setMessage({ type: 'success', text: 'Cập nhật trạng thái lịch khám thành công!' });
      fetchAppointments();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật trạng thái' });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createData.patient_id || !createData.service_id) {
      setMessage({ type: 'error', text: 'Vui lòng chọn đầy đủ Bệnh nhân và Dịch vụ.' });
      return;
    }
    try {
      await api.post('/appointments', {
        patient_id: parseInt(createData.patient_id),
        doctor_id: createData.doctor_id ? parseInt(createData.doctor_id) : null,
        chair_id: createData.chair_id ? parseInt(createData.chair_id) : null,
        service_id: parseInt(createData.service_id),
        date: createData.date,
        time_slot: createData.time_slot,
        notes: createData.notes
      });
      setMessage({ type: 'success', text: 'Thêm lịch khám thành công!' });
      setShowCreateModal(false);
      fetchAppointments();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra khi thêm lịch khám' });
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm Lịch Khám Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

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

      {/* Create New Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 border-l border-slate-200 animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">Thêm Lịch Khám Mới</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Bệnh Nhân (*)</label>
              <select
                value={createData.patient_id}
                onChange={(e) => setCreateData({ ...createData, patient_id: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                required
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.patient_code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Dịch Vụ Khám (*)</label>
              <select
                value={createData.service_id}
                onChange={(e) => setCreateData({ ...createData, service_id: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                required
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.price?.toLocaleString('vi-VN')}đ)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Bác Sĩ Phụ Trách</label>
                <select
                  value={createData.doctor_id}
                  onChange={(e) => setCreateData({ ...createData, doctor_id: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                >
                  <option value="">-- Chưa phân công --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phòng / Ghế Khám</label>
                <select
                  value={createData.chair_id}
                  onChange={(e) => setCreateData({ ...createData, chair_id: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                >
                  <option value="">-- Chưa chọn ghế --</option>
                  {chairs.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.room}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ngày Khám (*)</label>
                <input
                  type="date"
                  value={createData.date}
                  onChange={(e) => setCreateData({ ...createData, date: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Khung Giờ (*)</label>
                <select
                  value={createData.time_slot}
                  onChange={(e) => setCreateData({ ...createData, time_slot: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white font-medium text-slate-800"
                  required
                >
                  {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ghi Chú Y Tế / Yêu Cầu Special</label>
              <textarea
                rows={3}
                value={createData.notes}
                onChange={(e) => setCreateData({ ...createData, notes: e.target.value })}
                placeholder="Ghi chú thêm về lịch khám..."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                Hủy Bỏ
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20">
                Tạo Lịch Khám
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
