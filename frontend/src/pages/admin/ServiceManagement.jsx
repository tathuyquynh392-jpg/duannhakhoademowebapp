import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Activity, Plus, Search, Edit2, Trash2, X, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  'Khám và tư vấn',
  'Nha khoa tổng quát',
  'Chỉnh nha',
  'Phục hình răng',
  'Cấy ghép Implant',
  'Nha khoa thẩm mỹ',
  'Phẫu thuật & Tủy răng'
];

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Custom Confirm Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingService, setDeletingService] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    price: 300000,
    description: '',
    status: 'Hoạt động'
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchServices();
  }, [search, categoryFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services', { params: { search } });
      let filtered = res.data;
      if (categoryFilter) {
        filtered = filtered.filter(s => s.category === categoryFilter);
      }
      setServices(filtered);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên dịch vụ.' });
      return;
    }
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
        setMessage({ type: 'success', text: 'Cập nhật dịch vụ thành công!' });
      } else {
        await api.post('/services', formData);
        setMessage({ type: 'success', text: 'Thêm mới dịch vụ nha khoa thành công!' });
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  const promptDelete = (s) => {
    setDeletingService(s);
    setDeleteConfirmId(s.id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/services/${deleteConfirmId}`);
      setMessage({ type: 'success', text: 'Xóa dịch vụ thành công.' });
      setDeleteConfirmId(null);
      setDeletingService(null);
      fetchServices(); // Automatically refreshes without page reload F5
    } catch (err) {
      const detailMsg = err.response?.data?.detail || 'Không thể xóa dịch vụ này.';
      setMessage({ type: 'error', text: detailMsg });
      setDeleteConfirmId(null);
      setDeletingService(null);
    }
  };

  const openEdit = (s) => {
    setEditingService(s);
    setFormData({
      name: s.name,
      category: s.category || CATEGORIES[0],
      price: s.price,
      description: s.description || '',
      status: s.status || 'Hoạt động'
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0],
      price: 300000,
      description: '',
      status: 'Hoạt động'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-600" />
            Quản Lý Dịch Vụ Nha Khoa
          </h2>
          <p className="text-xs text-slate-500">Danh mục dịch vụ, phân loại danh mục và chi phí niêm yết</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingService(null); setShowModal(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm Dịch Vụ Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: '', text: '' })} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
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
            placeholder="Tìm tên dịch vụ, mã dịch vụ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-4 py-2 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">Tất cả danh mục</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải danh mục dịch vụ...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã DV</th>
                  <th className="p-4">Tên Dịch Vụ</th>
                  <th className="p-4">Danh Mục</th>
                  <th className="p-4">Đơn Giá Niêm Yết</th>
                  <th className="p-4">Mô Tả</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-sky-700 font-mono">{s.service_code}</td>
                    <td className="p-4 font-bold text-slate-900">{s.name}</td>
                    <td className="p-4 text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {s.category || 'Nha khoa tổng quát'}
                      </span>
                    </td>
                    <td className="p-4 font-black text-sky-700 text-sm">{s.price?.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{s.description || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${s.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(s)} title="Sửa dịch vụ" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => promptDelete(s)} title="Xóa dịch vụ" className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
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

      {/* Confirmation Modal for Deletion */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-amber-900 uppercase">Xác nhận xóa dịch vụ</h4>
                <p className="text-xs text-amber-700 font-medium">Hành động này không thể hoàn tác nếu chưa được tham chiếu.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-semibold text-center py-2">
              Bạn có chắc chắn muốn xóa dịch vụ <span className="text-sky-700 font-bold">"{deletingService?.name}"</span> này không?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setDeleteConfirmId(null); setDeletingService(null); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 border-l border-slate-200 animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">{editingService ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tên Dịch Vụ (*)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Khám tổng quát"
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Danh Mục Dịch Vụ (*)</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white font-medium text-slate-800"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Giá Niêm Yết (VNĐ) (*)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Mô Tả Chi Tiết</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả công dụng và thông tin kỹ thuật của dịch vụ..."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Trạng Thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white font-medium text-slate-800"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Ngừng cung cấp">Ngừng cung cấp</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
