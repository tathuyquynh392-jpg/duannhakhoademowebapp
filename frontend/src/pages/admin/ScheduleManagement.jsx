import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter,
  Clock, User, Stethoscope, CheckCircle, ShieldAlert, X, Trash2, Edit3, DoorOpen
} from 'lucide-react';

const ROOMS = [
  'Phòng khám 01',
  'Phòng khám 02',
  'Phòng khám 03',
  'Phòng Implant',
  'Phòng chỉnh nha',
  'Phòng phẫu thuật'
];

const ScheduleManagement = () => {
  // Navigation & View State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

  // Data States
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [chairs, setChairs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [doctorFilter, setDoctorFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetailSchedule, setSelectedDetailSchedule] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    doctor_id: '',
    chair_id: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '12:00',
    shift: 'Sáng',
    status: 'Đã xếp',
    notes: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [schRes, docRes, chairRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/doctors'),
        api.get('/dental-chairs')
      ]);
      setSchedules(schRes.data);
      setDoctors(docRes.data);
      setChairs(chairRes.data);

      if (docRes.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          doctor_id: docRes.data[0].id
        }));
      }
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get Monday of current date's week
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Date Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate week days array (7 days Mon -> Sun)
  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  // Unique Specializations list for filter
  const specializations = useMemo(() => {
    const set = new Set();
    doctors.forEach(d => {
      if (d.specialization) set.add(d.specialization);
    });
    return Array.from(set);
  }, [doctors]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (doctorFilter && s.doctor_id !== parseInt(doctorFilter)) return false;
      if (specFilter && s.doctor?.specialization !== specFilter) return false;
      if (roomFilter && s.chair?.room !== roomFilter) return false;
      return true;
    });
  }, [schedules, doctorFilter, specFilter, roomFilter]);

  // Date range title text
  const dateRangeLabel = useMemo(() => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];
      const d1 = firstDay.getDate().toString().padStart(2, '0');
      const d2 = lastDay.getDate().toString().padStart(2, '0');
      const month = (firstDay.getMonth() + 1).toString().padStart(2, '0');
      const year = firstDay.getFullYear();
      return `${d1} - ${d2} tháng ${month}, ${year}`;
    }
    if (viewMode === 'month') {
      return `Tháng ${(currentDate.getMonth() + 1).toString().padStart(2, '0')}, ${currentDate.getFullYear()}`;
    }
    return '';
  }, [currentDate, viewMode, weekDays]);

  // Status color styles mapping
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Đã xếp':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm';
      case 'Đang làm việc':
        return 'bg-sky-50 text-sky-900 border-sky-300 shadow-sm';
      case 'Chưa xếp':
        return 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm';
      case 'Nghỉ':
        return 'bg-slate-100 text-slate-700 border-slate-300 shadow-sm';
      case 'Bảo trì':
      case 'Không hoạt động':
        return 'bg-rose-50 text-rose-900 border-rose-300 shadow-sm';
      default:
        return 'bg-sky-50 text-sky-900 border-sky-300 shadow-sm';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Đã xếp': return 'bg-emerald-500';
      case 'Đang làm việc': return 'bg-sky-500 animate-pulse';
      case 'Chưa xếp': return 'bg-amber-500';
      case 'Nghỉ': return 'bg-slate-400';
      case 'Bảo trì': return 'bg-rose-500';
      default: return 'bg-sky-500';
    }
  };

  // Convert "HH:MM" to float hour (e.g. "08:30" -> 8.5)
  const parseHourFloat = (timeStr) => {
    if (!timeStr) return 8;
    const [h, m] = timeStr.split(':').map(Number);
    return h + (m || 0) / 60;
  };

  // Form submission handler for Add/Edit Schedule
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        doctor_id: parseInt(formData.doctor_id),
        chair_id: formData.chair_id ? parseInt(formData.chair_id) : null,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        shift: formData.shift,
        status: formData.status,
        notes: formData.notes
      };

      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule.id}`, payload);
        setMessage({ type: 'success', text: 'Cập nhật lịch làm việc thành công!' });
      } else {
        await api.post('/schedules', payload);
        setMessage({ type: 'success', text: 'Thêm lịch làm việc mới thành công!' });
      }

      setShowAddModal(false);
      setEditingSchedule(null);
      fetchInitialData();
    } catch (err) {
      const errDetail = err.response?.data?.detail || 'Có lỗi xảy ra';
      setMessage({ type: 'error', text: errDetail });
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này không?')) return;
    try {
      await api.delete(`/schedules/${id}`);
      setMessage({ type: 'success', text: 'Xóa lịch làm việc thành công!' });
      setSelectedDetailSchedule(null);
      fetchInitialData();
    } catch (err) {
      alert('Không thể xóa lịch làm việc');
    }
  };

  const openEmptySlotAdd = (dateStr, hour) => {
    const formattedHour = hour.toString().padStart(2, '0') + ':00';
    const endHour = (hour + 4 <= 21 ? hour + 4 : 21).toString().padStart(2, '0') + ':00';
    const shift = hour < 12 ? 'Sáng' : hour < 18 ? 'Chiều' : 'Tối';

    setEditingSchedule(null);
    setFormData({
      doctor_id: doctors[0]?.id || '',
      chair_id: chairs[0]?.id || '',
      date: dateStr,
      start_time: formattedHour,
      end_time: endHour,
      shift: shift,
      status: 'Đã xếp',
      notes: ''
    });
    setShowAddModal(true);
  };

  const openEditFromDetail = (sched) => {
    setSelectedDetailSchedule(null);
    setEditingSchedule(sched);
    setFormData({
      doctor_id: sched.doctor_id,
      chair_id: sched.chair_id || '',
      date: sched.date,
      start_time: sched.start_time,
      end_time: sched.end_time,
      shift: sched.shift,
      status: sched.status,
      notes: sched.notes || ''
    });
    setShowAddModal(true);
  };

  // Time grid hours (08:00 to 18:00)
  const hoursGrid = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const HOUR_HEIGHT = 64; // pixels per hour block

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header & Calendar Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          
          {/* Date Navigation & Label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={handlePrev}
                className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-all"
                title="Lịch trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 bg-white text-sky-800 font-extrabold text-xs rounded-lg shadow-sm hover:bg-sky-50 transition-all border border-slate-200"
              >
                Hôm Nay
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-all"
                title="Lịch tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                {dateRangeLabel}
              </h2>
            </div>
          </div>

          {/* Action Button & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'day' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'week' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'month' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tháng
              </button>
            </div>

            <button
              onClick={() => {
                setEditingSchedule(null);
                setFormData({
                  doctor_id: doctors[0]?.id || '',
                  chair_id: chairs[0]?.id || '',
                  date: new Date().toISOString().split('T')[0],
                  start_time: '08:00',
                  end_time: '12:00',
                  shift: 'Sáng',
                  status: 'Đã xếp',
                  notes: ''
                });
                setShowAddModal(true);
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm Lịch Làm Việc
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-sky-600" />
            <span>Bộ lọc:</span>
          </div>

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="">Tất cả bác sĩ nha khoa</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.full_name}</option>
            ))}
          </select>

          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="">Tất cả chuyên khoa</option>
            {specializations.map((spec, i) => (
              <option key={i} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="">Tất cả phòng khám</option>
            {ROOMS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Color Legend */}
          <div className="ml-auto hidden md:flex items-center gap-3 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Đã xếp</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Đang làm việc</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Chưa xếp</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Nghỉ</span>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. WEEK VIEW (DẠNG TUẦN - DEFAULT)                        */}
      {/* ========================================================= */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* 7 Columns Day Headers */}
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-bold text-slate-700 sticky top-0 z-20">
            <div className="p-3 border-r border-slate-200 text-slate-400 font-extrabold flex items-center justify-center">
              Giờ
            </div>
            {weekDays.map((d, i) => {
              const dStr = d.toISOString().split('T')[0];
              const isToday = dStr === new Date().toISOString().split('T')[0];
              const dayName = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()];
              const dateFormatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;

              return (
                <div
                  key={i}
                  className={`p-3 border-r border-slate-200 flex flex-col items-center justify-center transition-colors ${
                    isToday ? 'bg-sky-50 text-sky-800' : ''
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{dayName}</span>
                  <span className={`text-xs font-black mt-0.5 px-2 py-0.5 rounded-full ${
                    isToday ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-900'
                  }`}>
                    {dateFormatted}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Calendar Body Timeline Grid */}
          <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative">
            <div className="grid grid-cols-8 min-w-[800px] relative" style={{ height: `${hoursGrid.length * HOUR_HEIGHT}px` }}>
              
              {/* Left Time Axis Column */}
              <div className="border-r border-slate-200 bg-slate-50/40 text-slate-400 font-mono text-[11px] font-bold select-none">
                {hoursGrid.map((h, i) => (
                  <div key={i} className="h-16 border-b border-slate-100 pr-2 pt-1 text-right">
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* 7 Columns for Days */}
              {weekDays.map((d, dayIdx) => {
                const dateStr = d.toISOString().split('T')[0];
                const daySchedules = filteredSchedules.filter(s => s.date === dateStr);

                return (
                  <div key={dayIdx} className="border-r border-slate-200 relative group/col">
                    {/* Hourly grid background lines & click triggers */}
                    {hoursGrid.map((h, hourIdx) => (
                      <div
                        key={hourIdx}
                        onClick={() => openEmptySlotAdd(dateStr, h)}
                        className="h-16 border-b border-slate-100 hover:bg-sky-50/30 transition-colors cursor-pointer relative"
                        title={`Click để thêm lịch làm việc vào ${h}:00 ngày ${dateStr}`}
                      />
                    ))}

                    {/* Schedule Cards rendered directly on time grid */}
                    {daySchedules.map((sched) => {
                      const startH = parseHourFloat(sched.start_time);
                      const endH = parseHourFloat(sched.end_time);
                      const topPx = Math.max(0, (startH - 8) * HOUR_HEIGHT);
                      const heightPx = Math.max(48, (endH - startH) * HOUR_HEIGHT);

                      return (
                        <div
                          key={sched.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailSchedule(sched);
                          }}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx - 4}px`,
                            left: '3px',
                            right: '3px',
                          }}
                          className={`absolute z-10 p-2.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] hover:z-30 overflow-hidden flex flex-col justify-between ${getStatusBadgeStyle(sched.status)}`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-extrabold text-[11px] truncate leading-tight">
                                {sched.doctor?.full_name || 'Bác sĩ'}
                              </span>
                              <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDotColor(sched.status)}`}></span>
                            </div>
                            <p className="text-[10px] opacity-80 truncate font-semibold">
                              {sched.doctor?.specialization || 'Nha khoa'}
                            </p>
                          </div>

                          <div className="mt-1 pt-1 border-t border-black/10 flex items-center justify-between text-[10px] font-bold">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 opacity-70" /> {sched.start_time} - {sched.end_time}
                            </span>
                            <span className="opacity-90">{sched.chair?.room || sched.chair?.name || sched.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DAY VIEW (DẠNG NGÀY)                                   */}
      {/* ========================================================= */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="pb-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">
              Lịch Làm Việc Ngày: {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            </h3>
            <span className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-bold">
              {filteredSchedules.filter(s => s.date === currentDate.toISOString().split('T')[0]).length} ca làm việc
            </span>
          </div>

          <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/30">
            {hoursGrid.map((h, i) => {
              const dateStr = currentDate.toISOString().split('T')[0];
              const hourSchedules = filteredSchedules.filter(s => {
                if (s.date !== dateStr) return false;
                const startH = parseHourFloat(s.start_time);
                return startH >= h && startH < h + 1;
              });

              return (
                <div key={i} className="min-h-[72px] border-b border-slate-200 p-3 flex gap-4 hover:bg-sky-50/20 transition-colors">
                  <div className="w-16 font-mono text-xs font-bold text-slate-400 pt-1 border-r border-slate-200">
                    {h.toString().padStart(2, '0')}:00
                  </div>

                  <div className="flex-1 flex flex-wrap gap-3 items-start">
                    {hourSchedules.length === 0 ? (
                      <span
                        onClick={() => openEmptySlotAdd(dateStr, h)}
                        className="text-xs text-slate-300 italic cursor-pointer hover:text-sky-600 transition-colors py-1"
                      >
                        + Khung giờ trống (Click để thêm lịch)
                      </span>
                    ) : (
                      hourSchedules.map((sched) => (
                        <div
                          key={sched.id}
                          onClick={() => setSelectedDetailSchedule(sched)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-105 shadow-sm max-w-md w-full ${getStatusBadgeStyle(sched.status)}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-extrabold text-xs">{sched.doctor?.full_name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60">
                              {sched.status}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-90">{sched.doctor?.specialization}</p>
                          <div className="mt-2 text-[11px] font-bold flex items-center gap-3">
                            <span>🕒 {sched.start_time} - {sched.end_time} ({sched.shift})</span>
                            {sched.chair && <span>🪑 {sched.chair.name} ({sched.chair.room})</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MONTH VIEW (DẠNG THÁNG)                                */}
      {/* ========================================================= */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="grid grid-cols-7 border-b border-slate-200 pb-3 text-center text-xs font-extrabold text-slate-600 uppercase">
            <div>Thứ 2</div>
            <div>Thứ 3</div>
            <div>Thứ 4</div>
            <div>Thứ 5</div>
            <div>Thứ 6</div>
            <div>Thứ 7</div>
            <div>Chủ nhật</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              const firstDayOfMonth = new Date(year, month, 1);
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              
              let startingDay = firstDayOfMonth.getDay() - 1;
              if (startingDay === -1) startingDay = 6;

              const cells = [];
              for (let i = 0; i < startingDay; i++) {
                cells.push(<div key={`empty-${i}`} className="h-28 bg-slate-50/50 rounded-2xl border border-slate-100 opacity-30"></div>);
              }

              for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
                const dateObj = new Date(year, month, dayNum);
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                const daySchedules = filteredSchedules.filter(s => s.date === dateStr);
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                cells.push(
                  <div
                    key={dayNum}
                    onClick={() => {
                      setCurrentDate(dateObj);
                      setViewMode('day');
                    }}
                    className={`h-32 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:border-sky-500 ${
                      isToday ? 'bg-sky-50/50 border-sky-400 font-bold' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        isToday ? 'bg-sky-600 text-white' : 'text-slate-800'
                      }`}>
                        {dayNum}
                      </span>
                      {daySchedules.length > 0 && (
                        <span className="text-[10px] text-sky-700 font-extrabold">
                          {daySchedules.length} ca
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden flex-1">
                      {daySchedules.slice(0, 2).map(s => (
                        <div key={s.id} className="text-[10px] bg-slate-100 p-1 rounded font-medium truncate text-slate-800">
                          • {s.doctor?.full_name?.replace('BS. CKI ', '')}: {s.start_time}-{s.end_time}
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <span className="text-[10px] text-sky-600 font-bold block text-right">
                          + {daySchedules.length - 2} lịch khác
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL: CHI TIẾT LỊCH LÀM VIỆC                            */}
      {/* ========================================================= */}
      {selectedDetailSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full animate-fade-in border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200 uppercase">
                  Chi Tiết Lịch Làm Việc
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{selectedDetailSchedule.doctor?.full_name}</h3>
                <p className="text-xs text-slate-500">{selectedDetailSchedule.doctor?.specialization}</p>
              </div>
              <button onClick={() => setSelectedDetailSchedule(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="flex items-center gap-2 text-slate-700">
                  <CalendarIcon className="w-4 h-4 text-sky-600" />
                  <span>Ngày làm việc: <strong className="text-slate-900">{selectedDetailSchedule.date}</strong></span>
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Khung giờ: <strong className="text-slate-900">{selectedDetailSchedule.start_time} - {selectedDetailSchedule.end_time}</strong> ({selectedDetailSchedule.shift})</span>
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  <span>Ghế phân công: <strong className="text-slate-900">{selectedDetailSchedule.chair?.name ? `${selectedDetailSchedule.chair.name} (${selectedDetailSchedule.chair.room})` : 'Chưa xếp ghế'}</strong></span>
                </p>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-600">Trạng thái:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${getStatusBadgeStyle(selectedDetailSchedule.status)}`}>
                  {selectedDetailSchedule.status}
                </span>
              </div>

              {selectedDetailSchedule.notes && (
                <div className="p-3 bg-sky-50/50 rounded-2xl border border-sky-200 text-sky-900">
                  <span className="font-bold block mb-1">Ghi chú:</span>
                  <p>{selectedDetailSchedule.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => openEditFromDetail(selectedDetailSchedule)}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Chỉnh Sửa
              </button>
              <button
                onClick={() => handleDeleteSchedule(selectedDetailSchedule.id)}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex justify-center items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Xóa
              </button>
              <button
                onClick={() => setSelectedDetailSchedule(null)}
                className="py-2.5 px-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: THÊM / SỬA LỊCH LÀM VIỆC                         */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 border-l border-slate-200 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">
              {editingSchedule ? 'Chỉnh Sửa Lịch Làm Việc' : 'Thêm Lịch Làm Việc Mới'}
            </h3>
            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Bác Sĩ Nha Khoa (*)</label>
              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold bg-white"
                required
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phân Công Ghế Khám & Phòng</label>
              <select
                value={formData.chair_id}
                onChange={(e) => setFormData({ ...formData, chair_id: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="">-- Không phân ghế cụ thể --</option>
                {chairs.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.room})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ngày Làm Việc (*)</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold text-sky-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Giờ Bắt Đầu (*)</label>
                <input
                  type="text"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  placeholder="08:00"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Giờ Kết Thúc (*)</label>
                <input
                  type="text"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  placeholder="12:00"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ca Làm Việc</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="Sáng">Ca Sáng (08:00 - 12:00)</option>
                <option value="Chiều">Ca Chiều (13:30 - 17:30)</option>
                <option value="Tối">Ca Tối (18:00 - 21:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Trạng Thái Lịch</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="Đã xếp">Đã xếp</option>
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Chưa xếp">Chưa xếp</option>
                <option value="Nghỉ">Nghỉ</option>
                <option value="Bảo trì">Bảo trì / Không hoạt động</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ghi Chú</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú nội dung công việc ca khám..."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20"
              >
                {editingSchedule ? 'Cập Nhật Lịch' : 'Lưu Lịch Làm Việc'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
