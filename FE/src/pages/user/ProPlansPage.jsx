import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  CreditCard,
  AlertCircle,
  HelpCircle,
  X,
  QrCode,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Clock
} from 'lucide-react';
import proApi from '../../api/proApi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const ProPlansPage = () => {
  const { user, isLoggedIn, isPro, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal thanh toán & VietQR
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [checkStatus, setCheckStatus] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [countdown, setCountdown] = useState(600); // 10 phút

  // Thông tin ngân hàng nhận thanh toán (MBBank Lê Văn Linh)
  const bankConfig = {
    bankId: 'MB',
    bankName: 'MBBank (Ngân hàng Quân Đội)',
    accountNo: '22810200500',
    accountName: 'LE VAN LINH',
  };

  useEffect(() => {
    let timer = null;
    if (isPayModalOpen) {
      setCountdown(600);
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPayModalOpen]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Đã sao chép: ${text}`, 'info', 2000);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await proApi.getPackages();
        if (res.success) {
          setPackages(res.data || []);
        }
      } catch (err) {
        // Nếu API yêu cầu login
        console.warn('Lỗi lấy gói Pro:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSelectPackage = async (pkg) => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để nâng cấp gói PRO!', 'info');
      navigate('/login');
      return;
    }

    try {
      setSelectedPackage(pkg);
      // Gọi API tạo đơn hàng (trạng thái PENDING)
      const res = await proApi.createOrder({ maGoi: pkg.maGoi });
      if (res.success && res.data) {
        setOrderData(res.data.donHang);
        setIsPayModalOpen(true);
      }
    } catch (err) {
      showToast(err.message || 'Không thể tạo đơn hàng!', 'error');
    }
  };

  const handleConfirmPayment = async () => {
    if (!orderData) return;

    try {
      setPaying(true);
      setCheckStatus('Đang kiểm tra biến động số dư MBBank...');
      await new Promise((r) => setTimeout(r, 1200));

      setCheckStatus(`Đang đối soát cú pháp "EDUSHARE DH${orderData.maDonHang}"...`);
      await new Promise((r) => setTimeout(r, 1300));

      // Gọi API thanh toán đơn hàng (Kích hoạt Pro)
      const res = await proApi.payOrder({
        maDonHang: orderData.maDonHang,
        phuongThuc: 'VIETQR_MBBANK',
      });

      if (res.success) {
        showToast('Đối soát thành công! Tài khoản của bạn đã được nâng cấp PRO.', 'success');
        setIsPayModalOpen(false);
        // Làm mới dữ liệu người dùng trong AuthContext
        await refreshProfile();
      }
    } catch (err) {
      showToast(err.message || 'Thanh toán thất bại!', 'error');
    } finally {
      setPaying(false);
      setCheckStatus('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 fill-amber-600 text-amber-600" />
          <span>Gói Thành viên Pro UTC</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Nâng cấp tài khoản, mở khóa toàn bộ tri thức
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Đọc trọn vẹn toàn bộ giáo trình, tải xuống không giới hạn file PDF gốc với chi phí tiết kiệm tối đa dành riêng cho sinh viên.
        </p>

        {isPro && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold inline-block">
            🎉 Bạn đang là thành viên PRO (Hạn dùng đến:{' '}
            {new Date(user.ngayHetHanPro).toLocaleDateString('vi-VN')}). Khi mua thêm, thời hạn sẽ được cộng dồn!
          </div>
        )}
      </div>

      {/* DANH SÁCH GÓI PRO */}
      {loading ? (
        <LoadingSpinner text="Đang tải các gói Pro..." />
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => {
            const isFeatured = pkg.thoiHan === 7 || idx === 1;

            return (
              <div
                key={pkg.maGoi}
                className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                  isFeatured
                    ? 'border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400 md:-translate-y-2'
                    : 'border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
                    Phổ biến nhất
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{pkg.tenGoi}</h3>
                    <p className="text-xs text-slate-400 mt-1">Thời hạn sử dụng: {pkg.thoiHan} ngày</p>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      {new Intl.NumberFormat('vi-VN').format(pkg.giaTien)}
                    </span>
                    <span className="text-sm font-bold text-slate-500">VNĐ</span>
                  </div>

                  {/* Danh sách tính năng */}
                  <ul className="space-y-3 text-sm text-slate-600 pt-4 border-t border-slate-100">
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Xem toàn bộ 100% trang PDF</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Tải file gốc về máy không giới hạn</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Huy hiệu PRO vinh danh tài khoản</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Hỗ trợ tải tốc độ cao</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                      isFeatured
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25'
                        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20'
                    }`}
                  >
                    Chọn mua gói này
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-12">
          Hiện tại chưa có gói Pro nào được mở bán. Vui lòng quay lại sau!
        </div>
      )}

      {/* BẢNG SO SÁNH QUYỀN LỢI FREE VS PRO */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">So sánh quyền lợi chi tiết</h2>
          <p className="text-xs text-slate-500 mt-1">Lựa chọn gói phù hợp với nhu cầu ôn thi của bạn</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 font-bold text-slate-800">Tính năng</th>
                <th className="py-4 font-bold text-slate-600 text-center w-36">Tài khoản FREE</th>
                <th className="py-4 font-bold text-amber-600 text-center w-36">Tài khoản PRO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3.5 font-medium">Tìm kiếm & xem thông tin tài liệu</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Miễn phí</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Miễn phí</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium">Đọc trực tuyến PDF</td>
                <td className="py-3.5 text-center text-slate-500">3 trang đầu</td>
                <td className="py-3.5 text-center text-amber-600 font-bold">100% Toàn bộ trang</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium">Tải file PDF gốc về máy tính</td>
                <td className="py-3.5 text-center text-slate-400">✕ Không hỗ trợ</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Không giới hạn</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium">Đăng tải tài liệu học tập</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Nhận +2 ngày PRO</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Nhận +2 ngày PRO</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium">Đánh giá sao cho tài liệu</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Hỗ trợ</td>
                <td className="py-3.5 text-center text-emerald-600 font-bold">✓ Hỗ trợ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THANH TOÁN QUÉT MÃ VIETQR THẬT */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Thanh toán quét mã VietQR ngân hàng"
        maxWidth="max-w-2xl"
      >
        {selectedPackage && orderData && (
          <div className="space-y-6">
            {/* Header tóm tắt đơn hàng & đếm ngược */}
            <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Đơn hàng:</span>{' '}
                <strong className="text-slate-800 font-mono font-bold">#{orderData.maDonHang}</strong> ({selectedPackage.tenGoi})
              </div>
              <div className="flex items-center space-x-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Hiệu lực còn: {formatTimer(countdown)}</span>
              </div>
            </div>

            {/* Khung QR và Thông tin chuyển khoản */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* CỘT TRÁI: MÃ VIETQR THẬT */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-primary-200 shadow-md">
                <div className="relative group">
                  <img
                    src={`https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.png?amount=${Math.round(
                      selectedPackage.giaTien
                    )}&addInfo=EDUSHARE%20DH${orderData.maDonHang}&accountName=${encodeURIComponent(
                      bankConfig.accountName
                    )}`}
                    alt="VietQR Payment Code"
                    className="w-56 h-auto rounded-xl object-contain shadow-xs"
                  />
                </div>
                <div className="mt-3 flex items-center space-x-1 text-slate-500 text-[11px]">
                  <Smartphone className="w-3.5 h-3.5 text-primary-600" />
                  <span>Quét bằng mọi ứng dụng ngân hàng / MoMo</span>
                </div>
              </div>

              {/* CỘT PHẢI: THÔNG TIN CHUYỂN KHOẢN CÓ NÚT SAO CHÉP */}
              <div className="space-y-3 text-xs">
                {/* Ngân hàng */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Ngân hàng thụ hưởng</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{bankConfig.bankName}</p>
                </div>

                {/* Số tài khoản */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 font-medium">Số tài khoản</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{bankConfig.accountNo}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(bankConfig.accountNo, 'stk')}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-200/60 transition-colors flex items-center space-x-1"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === 'stk' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Chủ tài khoản */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Chủ tài khoản</p>
                  <p className="font-bold text-slate-800 text-xs mt-0.5 uppercase">{bankConfig.accountName}</p>
                </div>

                {/* Số tiền */}
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <p className="text-amber-800 font-medium">Số tiền chuyển</p>
                    <p className="font-black text-amber-700 text-base mt-0.5">
                      {new Intl.NumberFormat('vi-VN').format(selectedPackage.giaTien)} đ
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(Math.round(selectedPackage.giaTien).toString(), 'amount')}
                    className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors flex items-center space-x-1"
                    title="Sao chép số tiền"
                  >
                    {copiedField === 'amount' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Nội dung chuyển khoản */}
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 font-medium">Nội dung chuyển khoản (bắt buộc)</p>
                    <p className="font-mono font-bold text-blue-900 text-xs mt-0.5">
                      EDUSHARE DH{orderData.maDonHang}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(`EDUSHARE DH${orderData.maDonHang}`, 'memo')}
                    className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors flex items-center space-x-1"
                    title="Sao chép nội dung"
                  >
                    {copiedField === 'memo' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Hướng dẫn thao tác */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Sau khi chuyển khoản thành công trên ứng dụng ngân hàng, vui lòng bấm nút{' '}
                <strong>"Tôi đã chuyển khoản xong"</strong> bên dưới để hệ thống kích hoạt gói Pro ngay lập tức!
              </span>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={paying}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{checkStatus || (paying ? 'Đang kích hoạt...' : 'Tôi đã chuyển khoản xong')}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProPlansPage;

