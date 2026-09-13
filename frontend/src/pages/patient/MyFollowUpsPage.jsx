import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Clock } from 'lucide-react';

const MyFollowUpsPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const res = await api.get('/follow-ups');
      setFollowUps(res.data);
    } catch (err) {
      console.error('Error fetching follow ups:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-teal-600" />
          Lịch Tái Khám Định Kỳ Của Tôi
        </h2>
        <p className="text-xs text-slate-500">Các cuộc hẹn tái kiểm tra răng miệng được bác sĩ chỉ định</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải lịch tái khám...</div>
        ) : followUps.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Bạn không có lịch tái khám nào sắp tới.
          </div>
        ) : (
          followUps.map((fu) => (
            <div key={fu.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{fu.content}</h3>
                <p className="text-xs text-slate-500">Ngày tái khám: <strong className="text-teal-700">{fu.date} lúc {fu.time}</strong> | Bác sĩ: {fu.doctor?.full_name}</p>
                {fu.notes && <p className="text-xs text-slate-400 italic mt-1">{fu.notes}</p>}
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {fu.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyFollowUpsPage;
