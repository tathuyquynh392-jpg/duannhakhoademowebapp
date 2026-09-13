import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserCog, Plus, Search, Edit2, Trash2, X, CheckCircle, ShieldAlert } from 'lucide-react';

const SPECIALIZATIONS = [
  'Răng tổng quát',
  'Nha khoa trẻ em',
  'Chỉnh nha',
  'Răng Hàm Mặt',
  'Nội nha',
  'Nha chu',
  'Phục hình răng',
  'Phục hình Răng Sứ & Thẩm mỹ',
  'Cấy ghép Implant',
  'Phẫu thuật miệng',
  'Răng giả',
  'Nha khoa thẩm mỹ',
  'Điều trị khớp thái dương hàm',
  'Chẩn đoán hình ảnh răng hàm mặt'
];

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    specialization: SPECIALIZATIONS[0],
    phone: '',
    email: '',
    experience_years: 5,
    status: 'Đang làm việc'
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDoctors();
  }, [search, statusFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors', { params: { search, status_filter: statusFilter } });
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.specialization) {
      setMessage({ type: 'error', text: 'Vui lòng chọn Chuyên khoa cho bác sĩ' });
      return;
    }
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, formData);
        setMessage({ type: 'success', text: 'Cập nhật bác sĩ thành công!' });
      } else {
        await api.post('/doctors', formData);
        setMessage({ type: 'success', text: 'Thêm bác sĩ mới thành công!' });
      }
      setShowModal(false);
      setEditingDoctor(null);
      resetForm();
      fetchDoctors();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này không?')) return;
    try {
      await api.delete(`/doctors/${id}`);
      setMessage({ type: 'success', text: 'Xóa bác sĩ thành công!' });
      fetchDoctors();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Không thể xóa bác sĩ' });
    }
  };

  const openEdit = (d) => {
    setEditingDoctor(d);
    setFormData({
      full_name: d.full_name,
      specialization: d.specialization || SPECIALIZATIONS[0],
      phone: d.phone,
      email: d.email || '',
      experience_years: d.experience_years,
      status: d.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      specialization: SPECIALIZATIONS[0],
      phone: '',
      email: '',
      experience_years: 5,
      status: 'Đang làm việc'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-sky-600" />
            Quản Lý Bác Sĩ
          </h2>
          <p className="text-xs text-slate-500">Đội ngũ bác sĩ chuyên khoa phòng khám Lucky Dental</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingDoctor(null); setShowModal(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm Bác Sĩ Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên bác sĩ, chuyên khoa..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-4 py-2 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Nghỉ phép">Nghỉ phép</option>
          <option value="Không hoạt động">Không hoạt động</option>
        </select>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải dữ liệu bác sĩ...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã BS</th>
                  <th className="p-4">Họ và Tên Bác Sĩ</th>
                  <th className="p-4">Chuyên Khoa</th>
                  <th className="p-4">Kinh Nghiệm</th>
                  <th className="p-4">Số Điện Thoại</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-sky-700">{d.doctor_code}</td>
                    <td className="p-4 font-bold text-slate-900">{d.full_name}</td>
                    <td className="p-4 text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-semibold border border-sky-100">
                        {d.specialization}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{d.experience_years} năm</td>
                    <td className="p-4 text-slate-600">{d.phone}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        d.status === 'Đang làm việc' ? 'bg-emerald-100 text-emerald-800' :
                        d.status === 'Nghỉ phép' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => openEdit(d)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto border-l border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">{editingDoctor ? 'Sửa Thông Tin Bác Sĩ' : 'Thêm Bác Sĩ Mới'}</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Họ và Tên Bác Sĩ (*)</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Chuyên Khoa (*)</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white font-medium text-slate-800"
                required
              >
                <option value="">-- Chọn chuyên khoa --</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại (*)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Số Năm Kinh Nghiệm</label>
                <input
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Trạng Thái Làm Việc</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Nghỉ phép">Nghỉ phép</option>
                <option value="Không hoạt động">Không hoạt động</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
