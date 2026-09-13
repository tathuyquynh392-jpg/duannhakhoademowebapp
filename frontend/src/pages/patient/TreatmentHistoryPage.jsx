import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { History, Stethoscope } from 'lucide-react';

const TreatmentHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/treatment-records');
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching treatment records:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-teal-600" />
          Lịch Sử Khám & Nhật Ký Điều Trị
        </h2>
        <p className="text-xs text-slate-500">Chi tiết quá trình chăm sóc răng miệng lâm sàng từ bác sĩ</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải hồ sơ điều trị...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Chưa có ghi nhận điều trị lâm sàng.
          </div>
        ) : (
          records.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{r.service?.name || 'Điều trị tổng quát'}</h3>
                  <p className="text-xs text-slate-500">Bác sĩ: {r.doctor?.full_name} | Ngày làm: {r.date}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-500 block mb-1">Tình trạng trước làm:</span>
                  <p className="text-slate-800">{r.pre_condition || 'Bình thường'}</p>
                </div>
                <div className="bg-teal-50/60 p-3 rounded-2xl border border-teal-200/60">
                  <span className="font-bold text-teal-800 block mb-1">Nội dung thao tác:</span>
                  <p className="text-teal-950 font-medium">{r.content}</p>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/60">
                  <span className="font-bold text-emerald-800 block mb-1">Kết quả sau điều trị:</span>
                  <p className="text-emerald-950 font-medium">{r.post_result || 'Tốt'}</p>
                </div>
              </div>

              {r.notes && <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl">Lời khuyên của bác sĩ: {r.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TreatmentHistoryPage;
