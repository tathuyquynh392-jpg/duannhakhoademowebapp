import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Receipt, Plus, Trash2, X, CheckCircle, ShieldAlert } from 'lucide-react';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [patientId, setPatientId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([{ service_id: '', service_name: '', quantity: 1, unit_price: 0 }]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, patRes, srvRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/patients'),
        api.get('/services')
      ]);
      setInvoices(invRes.data);
      setPatients(patRes.data);
      setServices(srvRes.data);

      if (patRes.data.length > 0) setPatientId(patRes.data[0].id);
      if (srvRes.data.length > 0) {
        setItems([{
          service_id: srvRes.data[0].id,
          service_name: srvRes.data[0].name,
          quantity: 1,
          unit_price: srvRes.data[0].price
        }]);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (index, srvId) => {
    const srv = services.find(s => s.id === parseInt(srvId));
    if (srv) {
      const updated = [...items];
      updated[index] = {
        service_id: srv.id,
        service_name: srv.name,
        quantity: updated[index].quantity || 1,
        unit_price: srv.price
      };
      setItems(updated);
    }
  };

  const addItemRow = () => {
    if (services.length > 0) {
      setItems([...items, {
        service_id: services[0].id,
        service_name: services[0].name,
        quantity: 1,
        unit_price: services[0].price
      }]);
    }
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/invoices', {
        patient_id: parseInt(patientId),
        date: new Date().toISOString().split('T')[0],
        discount: parseFloat(discount) || 0,
        items: items
      });
      setMessage({ type: 'success', text: 'Lập hóa đơn khám bệnh thành công!' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra khi tạo hóa đơn' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-teal-600" />
            Quản Lý Hóa Đơn & Viện Phí
          </h2>
          <p className="text-xs text-slate-500">Lập hóa đơn dịch vụ, quản lý miễn giảm và theo dõi công nợ</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Lập Hóa Đơn Mới
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Đang tải danh sách hóa đơn...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Mã Hóa Đơn</th>
                  <th className="p-4">Bệnh Nhân</th>
                  <th className="p-4">Ngày Lập</th>
                  <th className="p-4">Tổng Tiền</th>
                  <th className="p-4">Đã Thanh Toán</th>
                  <th className="p-4">Còn Phải Thu</th>
                  <th className="p-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-teal-700">{inv.invoice_code}</td>
                    <td className="p-4 font-bold text-slate-900">{inv.patient?.full_name}</td>
                    <td className="p-4 text-slate-500">{inv.date}</td>
                    <td className="p-4 font-black text-slate-900">{inv.total_amount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 font-bold text-emerald-600">{inv.paid_amount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 font-bold text-rose-600">{inv.remaining_amount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'Đã thanh toán một phần' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Generator */}
      {showModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl p-6 border-l border-slate-200 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
            <h3 className="font-bold text-slate-900 text-base">Lập Hóa Đơn Khám Bệnh Mới</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chọn Bệnh Nhân (*)</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.patient_code})</option>
                ))}
              </select>
            </div>

            {/* Line Items */}
            <div className="space-y-3 pt-2">
              <label className="block text-slate-700 font-bold">Chi Tiết Dịch Vụ Nha Khoa (*)</label>
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <select
                    value={item.service_id}
                    onChange={(e) => handleServiceSelect(idx, e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.price.toLocaleString('vi-VN')}đ)</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].quantity = parseInt(e.target.value) || 1;
                      setItems(updated);
                    }}
                    className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                  />
                  <span className="font-bold text-slate-900 text-xs w-28 text-right">
                    {(item.quantity * item.unit_price).toLocaleString('vi-VN')}đ
                  </span>
                  <button type="button" onClick={() => removeItemRow(idx)} className="p-1 text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addItemRow} className="text-teal-600 font-bold hover:underline text-xs flex items-center gap-1">
                + Thêm dịch vụ vào hóa đơn
              </button>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Giảm Giá / Chiết Khấu (VNĐ)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs space-y-1">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Tạm tính:</span>
                <span>{calculateSubtotal().toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between font-medium text-rose-600">
                <span>Giảm giá:</span>
                <span>-{(parseFloat(discount) || 0).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-teal-200">
                <span>Tổng cộng phải thanh toán:</span>
                <span className="text-teal-700">{Math.max(0, calculateSubtotal() - (parseFloat(discount) || 0)).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md">Lưu & Xuất Hóa Đơn</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
