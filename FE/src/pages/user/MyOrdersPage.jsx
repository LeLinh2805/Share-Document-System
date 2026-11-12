import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import proApi from '../../api/proApi';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await proApi.getMyOrders();
        if (res.success) {
          setOrders(res.data || []);
        }
      } catch (err) {
        console.warn('Lỗi lấy đơn hàng:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Lịch sử đơn hàng & Giao dịch</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Theo dõi các lần nâng cấp gói Pro và mã đối soát giao dịch
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải lịch sử đơn hàng..." />
      ) : orders.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Mã đơn</th>
                  <th className="py-3.5 px-6">Gói Pro</th>
                  <th className="py-3.5 px-6">Số tiền</th>
                  <th className="py-3.5 px-6">Trạng thái</th>
                  <th className="py-3.5 px-6">Ngày tạo</th>
                  <th className="py-3.5 px-6">Mã giao dịch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((ord) => {
                  const isPaid = ord.trangThai === 'PAID';
                  const isPending = ord.trangThai === 'PENDING';

                  return (
                    <tr key={ord.maDonHang} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900">
                        #{ord.maDonHang}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {ord.GoiPro?.tenGoi || 'Gói Pro'}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {new Intl.NumberFormat('vi-VN').format(ord.soTien)} đ
                      </td>
                      <td className="py-4 px-6">
                        {isPaid && (
                          <Badge variant="success" className="flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Thành công</span>
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="warning" className="flex items-center space-x-1 w-fit">
                            <Clock className="w-3 h-3" />
                            <span>Chờ thanh toán</span>
                          </Badge>
                        )}
                        {!isPaid && !isPending && (
                          <Badge variant="danger" className="w-fit">
                            Thất bại
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(ord.ngayTao).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                        {ord.GiaoDiches && ord.GiaoDiches.length > 0
                          ? ord.GiaoDiches[0].maGiaoDichThanhToan
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-500 space-y-3">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Bạn chưa có đơn hàng nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Khi bạn đặt mua các gói Pro, toàn bộ hóa đơn điện tử sẽ hiển thị tại đây.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

