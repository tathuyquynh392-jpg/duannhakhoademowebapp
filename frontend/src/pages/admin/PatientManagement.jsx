import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Search, Plus, Eye, Edit2, Trash2, X, CheckCircle, ShieldAlert, Key } from 'lucide-react';
import AddressSelector from '../../components/common/AddressSelector';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    gender: 'Nam',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'Hoạt động',
    create_account: true,
    username: '',
    password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPatients();
  }, [search, statusFilter]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients', {
        params: { search, status_filter: statusFilter }
      });
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!formData.address.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng chọn đầy đủ thông tin Địa chỉ theo các cấp Tỉnh -> Huyện -> Xã -> Tổ dân phố.' });
      return;
    }
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient.id}`, formData);
        setMessage({ type: 'success', text: 'Cập nhật thông tin bệnh nhân thành công!' });
      } else {
        await api.post('/patients', formData);
        setMessage({ type: 'success', text: 'Thêm mới bệnh nhân thành công!' });
      }
      setShowCreateModal(false);
      setEditingPatient(null);
      resetForm();
      fetchPatients();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này không?')) return;
    try {
      await api.delete(`/patients/${id}`);
      setMessage({ type: 'success', text: 'Xóa bệnh nhân thành công!' });
      fetchPatients();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Không thể xóa bệnh nhân' });
    }
  };

  const openEdit = (p) => {
    setEditingPatient(p);
    setFormData({
      full_name: p.full_name,
      dob: p.dob || '',
      gender: p.gender || 'Nam',
      phone: p.phone,
      email: p.email || '',
      address: p.address || '',
      notes: p.notes || '',
      status: p.status,
      create_account: false,
      username: '',
      password: ''
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      dob: '',
      gender: 'Nam',
      phone: '',
      email: '',
      address: '',
      notes: '',
      status: 'Hoạt động',
      create_account: true,
      username: '',
      password: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            Quản Lý Bệnh Nhân
          </h2>
          <p className="text-xs text-slate-500">Danh sách bệnh nhân đăng ký điều trị tại phòng khám Lucky Dental</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPatient(null); setShowCreateModal(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm Bệnh Nhân Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
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
            placeholder="Tìm theo Mã bệnh nhân, Họ tên, Số điện thoại..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-4 py-2 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Hoạt động">Hoạt động</option>
          <option value="Tạm dừng">Tạm dừng</option>
        </select>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải dữ liệu bệnh nhân...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">Chưa có dữ liệu bệnh nhân phù hợp</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã BN</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Số Điện Thoại</th>
                  <th className="p-4">Địa Chỉ (Hành Chính)</th>
                  <th className="p-4">Ngày Đăng Ký</th>
                  <th className="p-4">Tài Khoản</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-sky-700 font-mono">{p.patient_code}</td>
                    <td className="p-4 font-bold text-slate-900">{p.full_name}</td>
                    <td className="p-4 text-slate-600">{p.phone}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{p.address || '-'}</td>
                    <td className="p-4 text-slate-500">{p.registration_date}</td>
                    <td className="p-4">
                      {p.user_id ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200 flex items-center gap-1 w-fit">
                          <Key className="w-3 h-3" /> Đã có tài khoản
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Chưa tạo</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          to={`/admin/patients/${p.id}`}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa bệnh nhân"
                        >
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

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl p-6 overflow-y-auto border-l border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">
              {editingPatient ? 'Chỉnh Sửa Hồ Sơ Bệnh Nhân' : 'Tạo Mới Hồ Sơ Bệnh Nhân'}
            </h3>
            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Họ và Tên (*)</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                required
              />
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
                <label className="block text-slate-700 font-bold mb-1">Giới Tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ngày Sinh</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                />
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
            </div>

            {/* 4-Level Cascading Address Selector */}
            <AddressSelector
              value={formData.address}
              onChange={(newAddress) => setFormData({ ...formData, address: newAddress })}
              required={true}
            />

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ghi Chú Y Tế</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>

            {!editingPatient && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="create_account"
                    checked={formData.create_account}
                    onChange={(e) => setFormData({ ...formData, create_account: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                  <label htmlFor="create_account" className="font-bold text-slate-800 cursor-pointer">
                    Tự động tạo tài khoản đăng nhập cho bệnh nhân
                  </label>
                </div>

                {formData.create_account && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-slate-600 mb-1">Tên đăng nhập (Username)</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Ví dụ: patient04"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                        required={formData.create_account}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Mật khẩu (Password)</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                        required={formData.create_account}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20"
              >
                {editingPatient ? 'Cập Nhật' : 'Lưu Hồ Sơ'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
