import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Activity } from 'lucide-react';

const TreatmentProgressPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/treatment-plans');
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching treatment plans:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-teal-600" />
          Tiến Độ Liệu Trình Điều Trị
        </h2>
        <p className="text-xs text-slate-500">Theo dõi tiến trình phục hồi và các giai đoạn chỉnh nha / phục hình</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải liệu trình điều trị...</div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Bạn chưa có liệu trình điều trị nào.
          </div>
        ) : (
          plans.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 mb-1 inline-block">
                    {p.plan_code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{p.plan_name}</h3>
                  <p className="text-xs text-slate-500">Bác sĩ phụ trách: <strong className="text-slate-800">{p.doctor?.full_name}</strong> | Bắt đầu: {p.start_date}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">{p.status}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Tiến độ hoàn thành</span>
                  <span>{p.progress_percent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: `${p.progress_percent}%` }}></div>
                </div>
              </div>

              {p.notes && <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl">Ghi chú: {p.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TreatmentProgressPage;
