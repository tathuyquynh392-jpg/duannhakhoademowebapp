import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Receipt } from 'lucide-react';

const MyInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error('Error fetching my invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-teal-600" />
          Hóa Đơn & Chi Phí Điều Trị Của Tôi
        </h2>
        <p className="text-xs text-slate-500">Xem minh bạch các khoản viện phí, miễn giảm và dư nợ</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải hóa đơn...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Bạn chưa có hóa đơn nào.
          </div>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Hóa đơn {inv.invoice_code}</h3>
                  <p className="text-xs text-slate-500">Ngày lập: {inv.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  inv.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {inv.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 text-xs">
                {inv.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-medium text-slate-800">{item.service_name} (x{item.quantity})</span>
                    <span className="font-bold text-slate-900">{item.amount.toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Giảm giá / Miễn giảm:</span>
                  <span className="text-rose-600">-{inv.discount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Đã thanh toán:</span>
                  <span className="text-emerald-600 font-bold">{inv.paid_amount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-1">
                  <span>Còn lại cần thanh toán:</span>
                  <span className="text-teal-700">{inv.remaining_amount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyInvoicesPage;
