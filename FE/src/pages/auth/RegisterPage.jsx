import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import authApi from '../../api/authApi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (formData.matKhau.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.register({
        hoTen: formData.hoTen.trim(),
        email: formData.email.trim(),
        matKhau: formData.matKhau,
      });

      if (res.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký không thành công. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Đăng ký thành công!</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hệ thống đã gửi một liên kết kích hoạt đến địa chỉ email{' '}
            <strong className="text-slate-800">{formData.email}</strong>.
            <br />
            Vui lòng kiểm tra hộp thư (bao gồm cả thư mục Spam) và nhấn vào liên kết để kích hoạt tài khoản trước khi đăng nhập.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-block w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all"
            >
              Chuyển đến trang Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-md shadow-primary-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tạo tài khoản mới</h2>
          <p className="text-xs text-slate-500">
            Tham gia cộng đồng chia sẻ học liệu sinh viên UTC
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Họ và tên</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.hoTen}
                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="student@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.xacNhanMatKhau}
                onChange={(e) => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
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
              <span>Đang tạo tài khoản...</span>
            ) : (
              <>
                <span>Đăng ký ngay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

