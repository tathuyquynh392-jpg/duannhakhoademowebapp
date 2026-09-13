import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Stethoscope, Plus, Search, Edit2, Trash2, X, CheckCircle, ShieldAlert, DoorOpen } from 'lucide-react';

const ROOMS = [
  'Phòng khám 01',
  'Phòng khám 02',
  'Phòng khám 03',
  'Phòng Implant',
  'Phòng chỉnh nha',
  'Phòng phẫu thuật'
];

const STATUSES = ['Trống', 'Đang sử dụng', 'Đã đặt', 'Bảo trì'];

const ChairManagement = () => {
  const [chairs, setChairs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChair, setEditingChair] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    room: ROOMS[0],
    status: 'Trống',
    notes: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchChairs();
  }, [search, statusFilter, roomFilter]);

  const fetchChairs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dental-chairs', { params: { search, status_filter: statusFilter } });
      let filtered = res.data;
      if (roomFilter) {
        filtered = filtered.filter(c => c.room === roomFilter);
      }
      setChairs(filtered);
    } catch (err) {
      console.error('Error fetching chairs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.room) {
      setMessage({ type: 'error', text: 'Vui lòng chọn Phòng cho ghế khám' });
      return;
    }
    try {
      if (editingChair) {
        await api.put(`/dental-chairs/${editingChair.id}`, formData);
        setMessage({ type: 'success', text: 'Cập nhật ghế khám thành công!' });
      } else {
        await api.post('/dental-chairs', formData);
        setMessage({ type: 'success', text: 'Thêm ghế khám mới thành công!' });
      }
      setShowModal(false);
      setEditingChair(null);
      resetForm();
      fetchChairs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ghế khám này không?')) return;
    try {
      await api.delete(`/dental-chairs/${id}`);
      setMessage({ type: 'success', text: 'Xóa ghế khám thành công!' });
      fetchChairs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Không thể xóa ghế' });
    }
  };

  const openEdit = (c) => {
    setEditingChair(c);
    setFormData({
      name: c.name,
      room: c.room || ROOMS[0],
      status: c.status || 'Trống',
      notes: c.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      room: ROOMS[0],
      status: 'Trống',
      notes: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sky-600" />
            Quản Lý Ghế Khám Nha Khoa
          </h2>
          <p className="text-xs text-slate-500">Quản lý phân công ghế khám theo phòng chuyên môn</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingChair(null); setShowModal(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm Ghế Khám Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên ghế, mã ghế..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
        <select
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-4 py-2 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">Tất cả các phòng</option>
          {ROOMS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-4 py-2 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">Tất cả trạng thái</option>
          {STATUSES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Grid view of Dental Chairs grouped or listed */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Đang tải dữ liệu ghế khám...</div>
      ) : chairs.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          Chưa tìm thấy ghế khám nào phù hợp.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chairs.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-extrabold text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 font-mono">
                    {c.chair_code}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    c.status === 'Trống' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'Đang sử dụng' ? 'bg-blue-100 text-blue-800' :
                    c.status === 'Đã đặt' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center justify-between">
                  <span>{c.name}</span>
                </h3>
                
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <DoorOpen className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Phòng: <strong className="text-slate-800">{c.room}</strong></span>
                </div>

                {c.notes && (
                  <p className="text-xs text-slate-400 mt-2 italic">Ghi chú: {c.notes}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => openEdit(c)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 border-l border-slate-200 animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">{editingChair ? 'Sửa Ghế Khám' : 'Thêm Ghế Khám Mới'}</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tên Ghế Khám (*)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Ghế 01"
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Thuộc Phòng Khám (*)</label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white font-medium text-slate-800"
                required
              >
                <option value="">-- Chọn phòng --</option>
                {ROOMS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Trạng Thái Ghế</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white font-medium text-slate-800"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ghi Chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú về thiết bị hoặc tình trạng ghế..."
                rows={3}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
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

export default ChairManagement;
