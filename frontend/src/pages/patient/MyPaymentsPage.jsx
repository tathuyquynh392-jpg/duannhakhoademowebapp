import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard } from 'lucide-react';

const MyPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-teal-600" />
          Lịch Sử Giao Dịch Thanh Toán
        </h2>
        <p className="text-xs text-slate-500">Nhật ký thu tiền và phiếu thanh toán của bạn</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải lịch sử thanh toán...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">Bạn chưa có giao dịch thanh toán nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã Phiếu Thu</th>
                  <th className="p-4">Ngày Thanh Toán</th>
                  <th className="p-4">Số Tiền</th>
                  <th className="p-4">Phương Thức</th>
                  <th className="p-4">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-teal-700">{p.payment_code}</td>
                    <td className="p-4 text-slate-500">{p.payment_date}</td>
                    <td className="p-4 font-black text-emerald-600 text-sm">+{p.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 font-bold text-slate-700">{p.payment_method}</td>
                    <td className="p-4 text-slate-500">{p.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPaymentsPage;
