import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ClipboardList, Plus, Trash2, Edit2, X, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

const TreatmentPlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    service_id: '',
    plan_name: '',
    start_date: new Date().toISOString().split('T')[0],
    expected_end_date: '',
    estimated_cost: 0,
    progress_percent: 0,
    status: 'Đang điều trị',
    notes: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planRes, patRes, docRes, srvRes] = await Promise.all([
        api.get('/treatment-plans'),
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/services')
      ]);
      setPlans(planRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setServices(srvRes.data);

      if (patRes.data.length > 0 && docRes.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          patient_id: patRes.data[0].id,
          doctor_id: docRes.data[0].id,
        }));
      }
    } catch (err) {
      console.error('Error fetching treatment plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (serviceId) => {
    const selectedService = services.find(s => s.id === parseInt(serviceId));
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service_id: selectedService.id,
        plan_name: `Liệu trình ${selectedService.name}`,
        estimated_cost: selectedService.price || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        service_id: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service_id) {
      setMessage({ type: 'error', text: 'Vui lòng chọn Dịch vụ nha khoa cho liệu trình.' });
      return;
    }
    try {
      if (editingPlan) {
        await api.put(`/treatment-plans/${editingPlan.id}`, formData);
        setMessage({ type: 'success', text: 'Cập nhật liệu trình thành công!' });
      } else {
        await api.post('/treatment-plans', formData);
        setMessage({ type: 'success', text: 'Tạo mới liệu trình thành công!' });
      }
      setShowModal(false);
      setEditingPlan(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa liệu trình này không?')) return;
    try {
      await api.delete(`/treatment-plans/${id}`);
      setMessage({ type: 'success', text: 'Xóa liệu trình thành công!' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể xóa liệu trình này' });
    }
  };

  const openEdit = (p) => {
    setEditingPlan(p);
    setFormData({
      patient_id: p.patient_id,
      doctor_id: p.doctor_id,
      service_id: p.service_id || '',
      plan_name: p.plan_name,
      start_date: p.start_date || new Date().toISOString().split('T')[0],
      expected_end_date: p.expected_end_date || '',
      estimated_cost: p.estimated_cost,
      progress_percent: p.progress_percent,
      status: p.status,
      notes: p.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient_id: patients[0]?.id || '',
      doctor_id: doctors[0]?.id || '',
      service_id: '',
      plan_name: '',
      start_date: new Date().toISOString().split('T')[0],
      expected_end_date: '',
      estimated_cost: 0,
      progress_percent: 0,
      status: 'Đang điều trị',
      notes: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-sky-600" />
            Quản Lý Liệu Trình Điều Trị
          </h2>
          <p className="text-xs text-slate-500">Phác đồ điều trị được chọn trực tiếp từ Danh mục Dịch vụ Nha khoa</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPlan(null); setShowModal(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Tạo Liệu Trình Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid of Plans */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Đang tải danh sách liệu trình...</div>
      ) : plans.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          Chưa có liệu trình điều trị nào
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200 mb-2 inline-block font-mono">
                    {p.plan_code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{p.plan_name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Bệnh nhân: <strong className="text-slate-800">{p.patient?.full_name}</strong> | Bác sĩ: <strong className="text-slate-800">{p.doctor?.full_name}</strong>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{p.status}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Tiến độ thực hiện</span>
                  <span>{p.progress_percent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full transition-all duration-500" style={{ width: `${p.progress_percent}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-bold text-sky-700 text-sm">Chi phí dự kiến: {p.estimated_cost?.toLocaleString('vi-VN')}đ</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} title="Sửa liệu trình" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} title="Xóa liệu trình" className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl p-6 border-l border-slate-200 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">{editingPlan ? 'Sửa Liệu Trình' : 'Tạo Mới Liệu Trình'}</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Bệnh Nhân (*)</label>
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: parseInt(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                required
              >
                <option value="">-- Chọn bệnh nhân --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.patient_code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Bác Sĩ Phụ Trách (*)</label>
              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: parseInt(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
                required
              >
                <option value="">-- Chọn bác sĩ --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>
                ))}
              </select>
            </div>

            {/* Select Dịch vụ nha khoa from Catalog */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-2">
              <label className="block text-sky-900 font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" /> Chọn Dịch Vụ Nha Khoa (*):
              </label>
              <select
                value={formData.service_id}
                onChange={(e) => handleServiceSelect(e.target.value)}
                className="w-full p-2.5 border border-sky-300 rounded-xl focus:border-sky-600 focus:outline-none bg-white font-semibold text-slate-800"
                required
              >
                <option value="">-- Chọn dịch vụ từ danh mục --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.price?.toLocaleString('vi-VN')}đ ({s.category || 'Nha khoa tổng quát'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-sky-700 font-medium italic">
                * Tên liệu trình và chi phí dự kiến sẽ tự động cập nhật theo giá niêm yết của dịch vụ được chọn.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tên Liệu Trình (*)</label>
              <input
                type="text"
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                placeholder="Tên liệu trình điều trị..."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Chi Phí Dự Kiến (VNĐ)</label>
                <input
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-sky-700 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tiến Độ (%) (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress_percent}
                  onChange={(e) => setFormData({ ...formData, progress_percent: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Trạng Thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                <option value="Đang điều trị">Đang điều trị</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ghi Chú Y Tế & Chỉ Định</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú chi tiết cho bác sĩ điều trị..."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20">Lưu Liệu Trình</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TreatmentPlanManagement;
