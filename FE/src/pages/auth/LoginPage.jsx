import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import authApi from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    matKhau: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleResend = async () => {
    if (!formData.email.trim()) {
      showToast('Vui lòng nhập địa chỉ email của bạn ở trên trước!', 'warning');
      return;
    }

    try {
      setResending(true);
      setErrorMsg('');
      setResendSuccess('');
      const res = await authApi.resendVerification({ email: formData.email.trim() });
      if (res.success) {
        setResendSuccess(res.message || 'Đã gửi lại email xác thực thành công!');
        showToast('Đã gửi lại link kích hoạt vào Gmail của bạn!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Không thể gửi lại email xác thực!', 'error');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResendSuccess('');

    try {
      setLoading(true);
      const res = await authApi.login({
        email: formData.email.trim(),
        matKhau: formData.matKhau,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.taiKhoan);
        showToast('Đăng nhập thành công! Chào mừng bạn quay trở lại.', 'success');
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-md shadow-primary-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Đăng nhập tài khoản</h2>
          <p className="text-xs text-slate-500">
            Truy cập hệ thống chia sẻ tài liệu học tập UTC
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-rose-800 text-xs">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            {errorMsg.toLowerCase().includes('xác thực') && (
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-rose-700">Chưa nhận được hoặc link hết hạn?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-bold text-primary-700 hover:text-primary-800 underline disabled:opacity-50"
                >
                  {resending ? 'Đang gửi...' : 'Gửi lại link kích hoạt'}
                </button>
              </div>
            )}
          </div>
        )}

        {resendSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <div className="font-bold mb-1">Đã gửi lại thành công!</div>
            <div>{resendSuccess}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Mật khẩu</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
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
              <span>Đang đăng nhập...</span>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 space-y-2">
          <p className="text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
              Đăng ký tài khoản mới
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Link kích hoạt hết hạn?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-primary-600 hover:text-primary-700 underline"
            >
              {resending ? 'Đang gửi...' : 'Gửi lại email kích hoạt'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

