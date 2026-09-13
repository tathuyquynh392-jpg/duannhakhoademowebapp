import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Sparkles, Bot, CalendarPlus, Clock } from 'lucide-react';

const PatientServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const askAiAboutService = (serviceName) => {
    navigate('/patient/ai', { state: { initialPrompt: `Giải thích chi tiết dịch vụ ${serviceName} là gì, có đau không?` } });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-600" />
          Bảng Giá & Dịch Vụ Nha Khoa
        </h2>
        <p className="text-xs text-slate-500">Khám phá các kỹ thuật nha khoa chất lượng cao tại Lucky Dental</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Đang tải danh mục dịch vụ...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-500/50 transition-all">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-extrabold text-[11px] text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    {s.service_code}
                  </span>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {s.duration_minutes} phút
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{s.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{s.description || 'Chăm sóc nha khoa chuyên sâu chuẩn y khoa.'}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Giá niêm yết:</span>
                  <span className="font-black text-teal-700 text-base">{s.price.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => askAiAboutService(s.name)}
                    className="flex-1 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold text-xs flex justify-center items-center gap-1 border border-teal-200"
                  >
                    <Bot className="w-3.5 h-3.5" /> Hỏi AI về DV
                  </button>
                  <button
                    onClick={() => navigate('/patient/book')}
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex justify-center items-center gap-1 shadow-md shadow-teal-600/20"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" /> Đặt Lịch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientServicesPage;
