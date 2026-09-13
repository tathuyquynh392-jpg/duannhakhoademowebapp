import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { Bot, Send, Trash2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

const PatientAiPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Chào bạn! Tôi là Trợ lý AI Nha khoa Lucky Dental. Bạn có câu hỏi nào về dịch vụ, chăm sóc răng miệng hay quy trình điều trị không?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.initialPrompt) {
      sendMessage(location.state.initialPrompt);
    }
  }, [location.state]);

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userText });
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.data.response, disclaimer: res.data.disclaimer }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Rất tiếc, hệ thống AI đang bận. Bạn vui lòng thử lại sau ít phút nhé!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const faqPrompts = [
    'Lấy cao răng có đau không?',
    'Niềng răng mất bao lâu?',
    'Chăm sóc sau khi nhổ răng khôn thế nào?',
    'Điều trị tủy răng là gì?'
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-6 h-6 text-teal-600" />
          AI Dental Assistant - Trợ Lý Chăm Sóc Răng Miệng
        </h2>
        <p className="text-xs text-slate-500">Hỏi đáp trực tiếp với trợ lý thông minh về kiến thức nha khoa 24/7</p>
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {faqPrompts.map((faq, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(faq)}
            className="px-3.5 py-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            {faq}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        <div className="p-4 bg-teal-800 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Lucky Dental AI Assistant</h3>
              <span className="text-[10px] text-teal-300 font-medium">Tư vấn sức khỏe răng miệng</span>
            </div>
          </div>
          <button
            onClick={() => setMessages([{ sender: 'ai', text: 'Cuộc trò chuyện đã được làm mới.' }])}
            className="text-xs text-teal-200 hover:text-white flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Làm mới
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-teal-600 text-white font-medium shadow-md shadow-teal-600/20'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
              }`}>
                {m.text}
                {m.disclaimer && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-medium flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{m.disclaimer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                AI đang suy nghĩ câu trả lời...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Hỏi AI về các dịch vụ nha khoa, niềng răng, tẩy trắng..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientAiPage;
