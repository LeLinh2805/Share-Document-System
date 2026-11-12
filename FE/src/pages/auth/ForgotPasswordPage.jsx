import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import authApi from '../../api/authApi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await authApi.forgotPassword({ email: email.trim() });
      if (res.success) {
        setIsSent(true);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi gửi yêu cầu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quên mật khẩu</h2>
          <p className="text-xs text-slate-500">
            Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu mới
          </p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nếu email <strong>{email}</strong> tồn tại trong hệ thống, chúng tôi đã gửi một hướng dẫn đặt lại mật khẩu vào hòm thư của bạn.
            </p>
            <p className="text-xs text-slate-400">
              Liên kết có hiệu lực trong vòng 15 phút.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Đang gửi liên kết...</span>
                ) : (
                  <>
                    <span>Gửi liên kết đặt lại mật khẩu</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại Đăng nhập</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

