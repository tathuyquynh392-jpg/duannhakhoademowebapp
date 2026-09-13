import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Clock, Plus, Trash2, X, CheckCircle, ShieldAlert } from 'lucide-react';

const FollowUpManagement = () => {
  const [followUps, setFollowUps] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    content: '',
    notes: '',
    status: 'Tái khám sắp tới'
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fuRes, patRes, docRes] = await Promise.all([
        api.get('/follow-ups'),
        api.get('/patients'),
        api.get('/doctors')
      ]);
      setFollowUps(fuRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);

      if (patRes.data.length > 0 && docRes.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          patient_id: patRes.data[0].id,
          doctor_id: docRes.data[0].id
        }));
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/follow-ups', formData);
      setMessage({ type: 'success', text: 'Tạo lịch tái khám thành công!' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-teal-600" />
            Quản Lý Lịch Tái Khám Định Kỳ
          </h2>
          <p className="text-xs text-slate-500">Lên lịch hẹn tái kiểm tra và sinh tin nhắn nhắc nhở cho bệnh nhân</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo Lịch Tái Khám
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải lịch tái khám...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Bệnh Nhân</th>
                  <th className="p-4">Nội Dung Tái Khám</th>
                  <th className="p-4">Ngày & Giờ</th>
                  <th className="p-4">Bác Sĩ Khám</th>
                  <th className="p-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {followUps.map((fu) => (
                  <tr key={fu.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{fu.patient?.full_name} ({fu.patient?.phone})</td>
                    <td className="p-4 font-bold text-slate-800">{fu.content}</td>
                    <td className="p-4 text-teal-700 font-bold">{fu.date} lúc {fu.time}</td>
                    <td className="p-4 text-slate-600">{fu.doctor?.full_name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        fu.status === 'Tái khám hôm nay' ? 'bg-amber-100 text-amber-800' :
                        fu.status === 'Đã khám' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {fu.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 border-l border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">Tạo Lịch Tái Khám Mới</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Bệnh Nhân (*)</label>
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: parseInt(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.patient_code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Bác Sĩ (*)</label>
              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: parseInt(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.full_name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ngày Tái Khám</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Giờ Tái Khám</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Nội Dung Tái Khám (*)</label>
              <input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Ví dụ: Kiểm tra lực siết mắc cài / chụp phim màng xương"
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md">Lưu Lịch Tái Khám</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FollowUpManagement;
