import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import authApi from '../../api/authApi';
import { useToast } from '../../contexts/ToastContext';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [token, setToken] = useState(tokenFromUrl);
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token.trim()) {
      setErrorMsg('Thiếu mã token xác thực!');
      return;
    }

    if (matKhauMoi !== xacNhanMatKhau) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (matKhauMoi.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.resetPassword({
        token: token.trim(),
        matKhauMoi,
      });

      if (res.success) {
        showToast('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.', 'success');
        navigate('/login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Đặt lại mật khẩu</h2>
          <p className="text-xs text-slate-500">
            Tạo mật khẩu mới an toàn cho tài khoản của bạn
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromUrl && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mã Token đặt lại</label>
              <input
                type="text"
                placeholder="Dán mã token từ link email vào đây"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu mới</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={matKhauMoi}
                onChange={(e) => setMatKhauMoi(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={xacNhanMatKhau}
                onChange={(e) => setXacNhanMatKhau(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Đang lưu mật khẩu mới...</span>
            ) : (
              <>
                <span>Lưu mật khẩu mới</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

