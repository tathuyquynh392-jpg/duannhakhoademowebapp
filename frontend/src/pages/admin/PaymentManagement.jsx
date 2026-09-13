import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, Plus, CheckCircle, ShieldAlert, X } from 'lucide-react';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'Tiền mặt',
    notes: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, invRes] = await Promise.all([
        api.get('/payments'),
        api.get('/invoices')
      ]);
      setPayments(payRes.data);
      
      // Filter unpaid or partially paid invoices
      const unpaid = invRes.data.filter(i => i.remaining_amount > 0);
      setInvoices(unpaid);
      if (unpaid.length > 0) {
        setFormData(prev => ({
          ...prev,
          invoice_id: unpaid[0].id,
          amount: unpaid[0].remaining_amount
        }));
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceChange = (invId) => {
    const inv = invoices.find(i => i.id === parseInt(invId));
    if (inv) {
      setFormData({
        ...formData,
        invoice_id: inv.id,
        amount: inv.remaining_amount
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', {
        invoice_id: parseInt(formData.invoice_id),
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        notes: formData.notes
      });
      setMessage({ type: 'success', text: 'Ghi nhận thanh toán thành công!' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-600" />
            Quản Lý Thanh Toán & Thu Tiền
          </h2>
          <p className="text-xs text-slate-500">Ghi nhận phiếu thu tiền mặt, chuyển khoản và tự động trừ công nợ</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ghi Nhận Thanh Toán
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Payment History List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải lịch sử thanh toán...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã Phiếu Thu</th>
                  <th className="p-4">Bệnh Nhân</th>
                  <th className="p-4">Số Tiền Thu</th>
                  <th className="p-4">Ngày Thu</th>
                  <th className="p-4">Phương Thức</th>
                  <th className="p-4">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-teal-700">{p.payment_code}</td>
                    <td className="p-4 font-bold text-slate-900">{p.patient?.full_name}</td>
                    <td className="p-4 font-black text-emerald-600 text-sm">+{p.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 text-slate-500">{p.payment_date}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-slate-100 font-bold text-slate-700">{p.payment_method}</span>
                    </td>
                    <td className="p-4 text-slate-500">{p.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 border-l border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">Ghi Nhận Phiếu Thu Tiền</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Hóa Đơn Cần Thanh Toán (*)</label>
              <select
                value={formData.invoice_id}
                onChange={(e) => handleInvoiceChange(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              >
                {invoices.length === 0 ? (
                  <option value="">Không có hóa đơn nợ nào</option>
                ) : (
                  invoices.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.invoice_code} - {i.patient?.full_name} (Còn nợ: {i.remaining_amount.toLocaleString('vi-VN')}đ)
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Số Tiền Thanh Toán (VNĐ) (*)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-black text-emerald-700 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phương Thức Thanh Toán</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              >
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản Ngân hàng</option>
                <option value="Khác">Khác (POS / Thẻ)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ghi Chú Giao Dịch</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ví dụ: Đã nhận tiền mặt tại lễ tân"
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md">Xác Nhận Thu Tiền</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
