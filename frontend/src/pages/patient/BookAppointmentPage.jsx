import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CalendarPlus, CheckCircle, ShieldAlert, Sparkles, Clock, Calendar } from 'lucide-react';

const BookAppointmentPage = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    service_id: '',
    doctor_id: '',
    date: new Date().toISOString().split('T')[0],
    time_slot: '09:00',
    notes: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const [srvRes, docRes] = await Promise.all([
        api.get('/services'),
        api.get('/doctors')
      ]);
      setServices(srvRes.data);
      setDoctors(docRes.data);

      if (srvRes.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          service_id: srvRes.data[0].id,
          doctor_id: docRes.data[0]?.id || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/appointments', {
        service_id: parseInt(formData.service_id),
        doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : null,
        date: formData.date,
        time_slot: formData.time_slot,
        notes: formData.notes
      });
      setMessage({ type: 'success', text: 'Đặt lịch khám thành công! Lịch hẹn của bạn đang ở trạng thái [Chờ xác nhận].' });
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Trùng lịch khám hoặc có lỗi xảy ra' });
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:30', '19:30'];

  if (loading) return <div className="p-12 text-center text-xs text-slate-400">Đang tải biểu mẫu đặt lịch...</div>;

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarPlus className="w-6 h-6 text-sky-600" />
          Đặt Lịch Khám Trực Tuyến
        </h2>
        <p className="text-xs text-slate-500">Lựa chọn dịch vụ nha khoa, bác sĩ và khung giờ phù hợp với bạn</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-medium">
          {/* Service Selection */}
          <div>
            <label className="block text-slate-700 font-bold mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-sky-600" /> 1. Chọn Dịch Vụ Nha Khoa (*)
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setFormData({ ...formData, service_id: s.id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                    formData.service_id === s.id
                      ? 'border-sky-600 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{s.name}</h4>
                    <span className="text-[11px] text-slate-500">{s.category || 'Dịch vụ nha khoa'}</span>
                  </div>
                  <span className="font-extrabold text-sky-700 text-xs">{s.price?.toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">2. Lựa Chọn Bác Sĩ Nha Khoa (Không bắt buộc)</label>
            <select
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
            >
              <option value="">-- Phòng khám tự sắp xếp bác sĩ phù hợp --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 font-bold mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-sky-600" /> 3. Chọn Ngày Khám (*)
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sky-800 focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4 text-sky-600" /> 4. Chọn Khung Giờ Khám (*)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, time_slot: slot })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.time_slot === slot
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Ghi Chú Cho Bác Sĩ (Nếu có)</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ví dụ: Răng bị ê buốt nhẹ khi uống nước lạnh..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-sky-600/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Đang xử lý đặt lịch...' : 'Xác Nhận Gửi Lịch Khám'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
