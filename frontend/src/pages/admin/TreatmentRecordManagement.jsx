import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FileText, Plus, Trash2, Edit2, X, CheckCircle, ShieldAlert } from 'lucide-react';

const TreatmentRecordManagement = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    service_id: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    pre_condition: '',
    post_result: '',
    notes: '',
    next_plan: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recRes, patRes, docRes, srvRes] = await Promise.all([
        api.get('/treatment-records'),
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/services')
      ]);
      setRecords(recRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setServices(srvRes.data);

      if (patRes.data.length > 0 && docRes.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          patient_id: patRes.data[0].id,
          doctor_id: docRes.data[0].id,
          service_id: srvRes.data[0]?.id || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching treatment records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/treatment-records', formData);
      setMessage({ type: 'success', text: 'Ghi nhận nhật ký điều trị thành công!' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có muốn xóa hồ sơ ghi nhận này không?')) return;
    try {
      await api.delete(`/treatment-records/${id}`);
      setMessage({ type: 'success', text: 'Xóa hồ sơ thành công!' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể xóa hồ sơ' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Nhật Ký & Hồ Sơ Điều Trị Chi Tiết
          </h2>
          <p className="text-xs text-slate-500">Ghi nhận chi tiết lâm sàng từng buổi điều trị của bệnh nhân</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ghi Nhận Buổi Điều Trị
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải nhật ký điều trị...</div>
        ) : (
          records.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{r.patient?.full_name} ({r.patient?.patient_code})</h3>
                  <p className="text-xs text-slate-500">Bác sĩ thực hiện: <strong className="text-slate-800">{r.doctor?.full_name}</strong> | Ngày: {r.date}</p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-500 block mb-1">Tình trạng trước điều trị:</span>
                  <p className="text-slate-800">{r.pre_condition || 'Bình thường'}</p>
                </div>

                <div className="bg-teal-50/60 p-3 rounded-2xl border border-teal-200/60">
                  <span className="font-bold text-teal-800 block mb-1">Nội dung thao tác điều trị:</span>
                  <p className="text-teal-950 font-medium">{r.content}</p>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/60">
                  <span className="font-bold text-emerald-800 block mb-1">Kết quả sau điều trị:</span>
                  <p className="text-emerald-950 font-medium">{r.post_result || 'Tốt'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl p-6 border-l border-slate-200 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">Ghi Nhận Buổi Điều Trị</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Bệnh Nhân (*)</label>
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
              <label className="block text-slate-700 font-bold mb-1">Bác Sĩ Phụ Trách (*)</label>
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

            <div>
              <label className="block text-slate-700 font-bold mb-1">Nội Dung Điều Trị Lâm Sàng (*)</label>
              <textarea
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Mô tả kỹ thuật bác sĩ đã thực hiện..."
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tình Trạng Trước Khi Làm</label>
              <input
                type="text"
                value={formData.pre_condition}
                onChange={(e) => setFormData({ ...formData, pre_condition: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Kết Quả Sau Điều Trị</label>
              <input
                type="text"
                value={formData.post_result}
                onChange={(e) => setFormData({ ...formData, post_result: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md">Lưu Ghi Nhận</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TreatmentRecordManagement;
