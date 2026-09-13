import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Phone, Mail, MapPin, CheckCircle, ShieldAlert, Lock } from 'lucide-react';
import AddressSelector from '../../components/common/AddressSelector';

const ProfilePage = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.patientId) {
      fetchPatient();
    }
  }, [user]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/patients/${user.patientId}`);
      setPatient(res.data);
      setPhone(res.data.phone || '');
      setEmail(res.data.email || '');
      setAddress(res.data.address || '');
      setDob(res.data.dob || '');
    } catch (err) {
      console.error('Error fetching patient profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const addressParts = (address || '').split(',').map(s => s.trim()).filter(Boolean);
    if (addressParts.length < 4) {
      setMessage({ type: 'error', text: 'Vui lòng chọn đầy đủ địa chỉ.' });
      return;
    }
    try {
      await api.put(`/patients/${user.patientId}`, {
        phone,
        email,
        address,
        dob
      });
      setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
      fetchPatient();
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể cập nhật thông tin' });
    }
  };

  if (loading) return <div className="p-12 text-center text-xs text-slate-400">Đang tải thông tin cá nhân...</div>;

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600" />
          Hồ Sơ Cá Nhân Bệnh Nhân
        </h2>
        <p className="text-xs text-slate-500">Xem và cập nhật thông tin liên hệ của bạn tại Lucky Dental</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-sky-600/30">
            {patient?.full_name?.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900">{patient?.full_name}</h3>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block mt-1 font-mono">
              Mã Bệnh Nhân: {patient?.patient_code}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs font-medium">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                Số Điện Thoại <Phone className="w-3.5 h-3.5 text-sky-600" />
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                Email <Mail className="w-3.5 h-3.5 text-sky-600" />
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Ngày Sinh</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none max-w-md"
            />
          </div>

          {/* 4-Level Address Selector */}
          <AddressSelector
            value={address}
            onChange={(newAddr) => setAddress(newAddr)}
            required={true}
          />

          {/* Locked Information Note */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Lock className="w-4 h-4 text-slate-400" /> Thông tin bảo mật do phòng khám quản lý:
            </span>
            <p className="text-slate-500">
              Mã Bệnh Nhân (<strong>{patient?.patient_code}</strong>), Ghi chú y tế và Lịch sử bệnh án được bảo mật và chỉ chỉnh sửa trực tiếp bởi bác sĩ nha khoa.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition-all"
          >
            Lưu Thay Đổi Thông Tin
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
