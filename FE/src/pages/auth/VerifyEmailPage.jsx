import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, Mail, RefreshCw } from 'lucide-react';
import authApi from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VerifyEmailPage = () => {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');

  const token = paramToken || queryToken;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form resend email
  const [emailInput, setEmailInput] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState({ success: false, message: '' });

  const handleResend = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      setResending(true);
      setResendStatus({ success: false, message: '' });
      const res = await authApi.resendVerification({ email: emailInput.trim() });
      if (res.success) {
        setResendStatus({
          success: true,
          message: res.message || 'Đã gửi lại link kích hoạt mới! Vui lòng kiểm tra email của bạn.',
        });
      }
    } catch (err) {
      setResendStatus({
        success: false,
        message: err.message || 'Không thể gửi lại email xác thực!',
      });
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorMsg('Mã token xác thực không tồn tại trên đường dẫn!');
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        const res = await authApi.verifyEmail(token);
        if (res.success) {
          setSuccess(true);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Xác thực email thất bại hoặc liên kết đã hết hạn!');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full text-center space-y-6">
        {loading ? (
          <LoadingSpinner text="Đang tiến hành xác thực tài khoản của bạn..." />
        ) : success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Xác thực thành công!</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và sử dụng toàn bộ tính năng của hệ thống.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all"
              >
                <span>Đăng nhập ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Xác thực thất bại</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{errorMsg}</p>

            {/* Khung gửi lại email */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-primary-600" />
                <span>Gửi lại mã / link xác thực mới</span>
              </div>
              <p className="text-xs text-slate-500">
                Nếu link của bạn đã hết hạn, hãy nhập email tài khoản để hệ thống gửi lại link mới có hiệu lực 24 giờ.
              </p>

              {resendStatus.message && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    resendStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {resendStatus.message}
                </div>
              )}

              <form onSubmit={handleResend} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Nhập email tài khoản của bạn..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  disabled={resending}
                  className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>{resending ? 'Đang gửi mail...' : 'Nhận link xác thực mới'}</span>
                </button>
              </form>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                className="inline-block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Về trang đăng nhập
              </Link>
              <Link
                to="/"
                className="inline-block w-full py-1 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

