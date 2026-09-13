import React, { useState } from 'react';
import api from '../../services/api';
import { Bot, Send, Trash2, Sparkles, MessageSquare, BellRing, FileText, Copy, Check } from 'lucide-react';

const AiAssistantPage = () => {
  const [activeTool, setActiveTool] = useState('chat'); // 'chat', 'summary', 'reminder'

  // Chat State
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Xin chào Quản trị viên Lucky Dental! Tôi là Trợ lý AI Nha khoa. Tôi có thể giúp bạn giải đáp thắc mắc chuyên môn, tóm tắt điều trị hoặc tạo tin nhắn nhắc lịch tái khám cho bệnh nhân.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Summary Tool State
  const [summaryData, setSummaryData] = useState({ patient_name: 'Trần Thị Bích', treatment_history: ['Lấy cao răng', 'Gắn mắc cài niềng răng kim loại'], doctor_notes: 'Răng di chuyển đúng tiến độ phác đồ' });
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Reminder Tool State
  const [reminderData, setReminderData] = useState({ patient_name: 'Nguyễn Văn An', date: '2026-09-20', time: '09:00', content: 'Tái khám định kỳ lấy cao răng' });
  const [reminderResult, setReminderResult] = useState('');
  const [reminderLoading, setReminderLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userText });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response, disclaimer: res.data.disclaimer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Xin lỗi, có lỗi kết nối tới AI Service. Vui lòng thử lại sau.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    setSummaryLoading(true);
    try {
      const res = await api.post('/ai/summarize-treatment', summaryData);
      setSummaryResult(res.data.response);
    } catch (err) {
      setSummaryResult('Không thể tạo bản tóm tắt');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateReminder = async (e) => {
    e.preventDefault();
    setReminderLoading(true);
    try {
      const res = await api.post('/ai/generate-reminder', reminderData);
      setReminderResult(res.data.response);
    } catch (err) {
      setReminderResult('Không thể sinh tin nhắn');
    } finally {
      setReminderLoading(false);
    }
  };

  const copyReminder = () => {
    navigator.clipboard.writeText(reminderResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-600" />
            AI Dental Assistant - Trợ Lý Nha Khoa Thông Minh
          </h2>
          <p className="text-xs text-slate-500">Tích hợp mô hình AI tư vấn, tóm tắt lâm sàng và tạo tin nhắn nhắc lịch tự động</p>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTool('chat')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === 'chat' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Trò Chuyện Trực Tiếp AI
        </button>
        <button
          onClick={() => setActiveTool('summary')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === 'summary' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Tóm Tắt Quá Trình Điều Trị
        </button>
        <button
          onClick={() => setActiveTool('reminder')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === 'reminder' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <BellRing className="w-4 h-4" /> Sinh Tin Nhắn Nhắc Tái Khám
        </button>
      </div>

      {/* CHATBOT UI */}
      {activeTool === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[550px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Trợ Lý AI Lucky Dental</h3>
                <span className="text-[10px] text-teal-400 font-medium">Sẵn sàng phản hồi</span>
              </div>
            </div>
            <button
              onClick={() => setMessages([{ sender: 'ai', text: 'Lịch sử cuộc trò chuyện đã được xóa.' }])}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa hội thoại
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-teal-600 text-white font-medium shadow-md shadow-teal-600/20'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}>
                  {m.text}
                  {m.disclaimer && (
                    <p className="mt-2 text-[10px] text-amber-700 italic bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ {m.disclaimer}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                  AI đang phân tích câu hỏi...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập câu hỏi nha khoa hoặc yêu cầu tư vấn..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Gửi
            </button>
          </form>
        </div>
      )}

      {/* SUMMARY TOOL */}
      {activeTool === 'summary' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Nhập Thông Tin Điều Trị Bệnh Nhân</h3>
            <form onSubmit={handleGenerateSummary} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên Bệnh Nhân</label>
                <input
                  type="text"
                  value={summaryData.patient_name}
                  onChange={(e) => setSummaryData({ ...summaryData, patient_name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ghi Chú Của Bác Sĩ</label>
                <textarea
                  rows={4}
                  value={summaryData.doctor_notes}
                  onChange={(e) => setSummaryData({ ...summaryData, doctor_notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={summaryLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Tạo Bản Tóm Tắt Điều Trị
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4">Kết Quả AI Tóm Tắt</h3>
              {summaryResult ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                  {summaryResult}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400">
                  Bấm nút "Tạo Bản Tóm Tắt" để AI phân tích và tổng hợp thông tin.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REMINDER TOOL */}
      {activeTool === 'reminder' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Tạo Tin Nhắc Tái Khám (SMS/Zalo)</h3>
            <form onSubmit={handleGenerateReminder} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên Bệnh Nhân</label>
                <input
                  type="text"
                  value={reminderData.patient_name}
                  onChange={(e) => setReminderData({ ...reminderData, patient_name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ngày Tái Khám</label>
                  <input
                    type="date"
                    value={reminderData.date}
                    onChange={(e) => setReminderData({ ...reminderData, date: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giờ Hẹn</label>
                  <input
                    type="text"
                    value={reminderData.time}
                    onChange={(e) => setReminderData({ ...reminderData, time: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nội Dung Tái Khám</label>
                <input
                  type="text"
                  value={reminderData.content}
                  onChange={(e) => setReminderData({ ...reminderData, content: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={reminderLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Sinh Tin Nhắn Thân Thiện
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-base">Tin Nhắn Mẫu AI Sinh Ra</h3>
                {reminderResult && (
                  <button
                    onClick={copyReminder}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                )}
              </div>

              {reminderResult ? (
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 text-xs text-teal-950 font-medium whitespace-pre-line leading-relaxed">
                  {reminderResult}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400">
                  Nhập thông tin và bấm nút để AI sinh tin nhắn cá nhân hóa.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantPage;
