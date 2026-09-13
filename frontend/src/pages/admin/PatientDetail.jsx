import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { User, Calendar, Activity, Sparkles, Receipt, CreditCard, Clock, Image, ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);

  // Sub-tab data states
  const [appointments, setAppointments] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/patients/${id}`);
      setPatient(res.data);

      // Fetch related records
      const [appRes, planRes, recRes, invRes, payRes, fuRes, imgRes] = await Promise.all([
        api.get('/appointments', { params: { patient_id: id } }),
        api.get('/treatment-plans', { params: { patient_id: id } }),
        api.get('/treatment-records', { params: { patient_id: id } }),
        api.get('/invoices', { params: { patient_id: id } }),
        api.get('/payments', { params: { patient_id: id } }),
        api.get('/follow-ups', { params: { patient_id: id } }),
        api.get('/treatment-images', { params: { patient_id: id } }),
      ]);

      setAppointments(appRes.data);
      setTreatmentPlans(planRes.data);
      setTreatmentRecords(recRes.data);
      setInvoices(invRes.data);
      setPayments(payRes.data);
      setFollowUps(fuRes.data);
      setImages(imgRes.data);
    } catch (err) {
      console.error('Error fetching patient detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Đang tải thông tin bệnh nhân...</div>;
  }

  if (!patient) {
    return <div className="p-12 text-center text-xs text-rose-500 font-bold">Không tìm thấy bệnh nhân</div>;
  }

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'history', label: 'Lịch sử khám', icon: Calendar },
    { id: 'treatment', label: 'Quá trình điều trị', icon: Activity },
    { id: 'services', label: 'Dịch vụ', icon: Sparkles },
    { id: 'invoices', label: 'Hóa đơn', icon: Receipt },
    { id: 'payments', label: 'Thanh toán', icon: CreditCard },
    { id: 'followups', label: 'Lịch tái khám', icon: Clock },
    { id: 'images', label: 'Hình ảnh điều trị', icon: Image },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/admin/patients" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bệnh nhân
      </Link>

      {/* Patient Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-sky-600/30">
            {patient.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">{patient.full_name}</h2>
              <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-3 py-0.5 rounded-full font-bold">
                {patient.patient_code}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-sky-600" /> {patient.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-sky-600" /> {patient.email || 'N/A'}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-600" /> {patient.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${patient.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
          Trạng thái: {patient.status}
        </span>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[300px]">
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-800 border-b pb-2">Thông tin Hành chính</h3>
              <p><span className="text-slate-500">Mã bệnh nhân:</span> <strong className="text-slate-900 font-mono">{patient.patient_code}</strong></p>
              <p><span className="text-slate-500">Họ và tên:</span> <strong className="text-slate-900">{patient.full_name}</strong></p>
              <p><span className="text-slate-500">Ngày sinh:</span> <strong className="text-slate-900">{patient.dob || 'Chưa cập nhật'}</strong></p>
              <p><span className="text-slate-500">Giới tính:</span> <strong className="text-slate-900">{patient.gender}</strong></p>
              <p><span className="text-slate-500">Ngày đăng ký:</span> <strong className="text-slate-900">{patient.registration_date}</strong></p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-800 border-b pb-2">Liên hệ & Ghi chú Y tế</h3>
              <p><span className="text-slate-500">Số điện thoại:</span> <strong className="text-slate-900">{patient.phone}</strong></p>
              <p><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{patient.email || 'N/A'}</strong></p>
              <p><span className="text-slate-500">Địa chỉ (Hành chính):</span> <strong className="text-slate-900">{patient.address || 'N/A'}</strong></p>
              <p><span className="text-slate-500">Ghi chú y tế đặc biệt:</span> <strong className="text-rose-600">{patient.notes || 'Khỏe mạnh bình thường'}</strong></p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Lịch Sử Các Lần Khám</h3>
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có lịch sử khám</p>
            ) : (
              <div className="space-y-3 text-xs">
                {appointments.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{a.service?.name}</p>
                      <p className="text-slate-500">Ngày: {a.date} | Giờ: {a.time_slot} | Bác sĩ: {a.doctor?.full_name || 'Chưa xếp'}</p>
                      {a.notes && <p className="text-slate-400 italic mt-1">{a.notes}</p>}
                    </div>
                    <span className="px-3 py-1 rounded-full font-bold bg-sky-100 text-sky-800">{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Liệu Trình & Tiến Trình Điều Trị</h3>
            {treatmentPlans.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có liệu trình điều trị</p>
            ) : (
              <div className="space-y-4">
                {treatmentPlans.map((tp) => (
                  <div key={tp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{tp.plan_name}</h4>
                        <p className="text-slate-500">Mã: {tp.plan_code} | Bác sĩ phụ trách: {tp.doctor?.full_name}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full font-bold text-xs bg-indigo-100 text-indigo-800">{tp.status}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                        <span>Tiến độ điều trị</span>
                        <span>{tp.progress_percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-600 rounded-full" style={{ width: `${tp.progress_percent}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Danh Sách Dịch Vụ Đã Sử Dụng</h3>
            {treatmentRecords.map((r, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{r.service?.name || 'Điều trị tổng quát'}</p>
                  <p className="text-slate-500">Ngày thực hiện: {r.date}</p>
                </div>
                <span className="font-bold text-sky-700">{r.service?.price ? `${r.service.price.toLocaleString('vi-VN')}đ` : '-'}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Hóa Đơn Của Bệnh Nhân</h3>
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{inv.invoice_code} ({inv.date})</p>
                  <p className="text-slate-500">Tổng tiền: {inv.total_amount.toLocaleString('vi-VN')}đ | Đã thu: {inv.paid_amount.toLocaleString('vi-VN')}đ</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${inv.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Lịch Sử Giao Dịch Thanh Toán</h3>
            {payments.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{p.payment_code} - Phương thức: {p.payment_method}</p>
                  <p className="text-slate-500">Ngày: {p.payment_date} | {p.notes}</p>
                </div>
                <span className="font-black text-emerald-600 text-sm">+{p.amount.toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'followups' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Lịch Tái Khám Định Kỳ</h3>
            {followUps.map((fu) => (
              <div key={fu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{fu.content}</p>
                  <p className="text-slate-500">Ngày tái khám: {fu.date} lúc {fu.time} | Bác sĩ: {fu.doctor?.full_name}</p>
                </div>
                <span className="px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-800">{fu.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-4">Hình Ảnh Lâm Sàng Điều Trị</h3>
            {images.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có hình ảnh điều trị</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 p-2">
                    <img src={img.image_url} alt={img.title} className="w-full h-36 object-cover rounded-xl mb-2" />
                    <p className="font-bold text-xs text-slate-800 truncate">{img.title}</p>
                    <span className="text-[10px] text-sky-600 font-bold">{img.stage}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
