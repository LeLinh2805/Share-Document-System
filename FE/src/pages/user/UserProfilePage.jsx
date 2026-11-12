import React, { useState } from 'react';
import { User, Mail, Shield, Crown, Calendar, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import userApi from '../../api/userApi';
import Badge from '../../components/common/Badge';

const UserProfilePage = () => {
  const { user, isPro, updateUser, refreshProfile } = useAuth();
  const { showToast } = useToast();

  // State cập nhật họ tên
  const [hoTen, setHoTen] = useState(user?.hoTen || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // State đổi mật khẩu
  const [passData, setPassData] = useState({
    matKhauCu: '',
    matKhauMoi: '',
    xacNhanMatKhau: '',
  });
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!hoTen.trim()) {
      showToast('Họ tên không được để trống!', 'error');
      return;
    }

    try {
      setUpdatingProfile(true);
      const res = await userApi.updateProfile({ hoTen: hoTen.trim() });
      if (res.success) {
        updateUser({ hoTen: res.data.hoTen });
        showToast('Cập nhật họ tên thành công!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật thông tin', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');

    if (passData.matKhauMoi !== passData.xacNhanMatKhau) {
      setPassError('Mật khẩu mới xác nhận không khớp!');
      return;
    }

    if (passData.matKhauMoi.length < 6) {
      setPassError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setChangingPass(true);
      const res = await userApi.changePassword({
        matKhauCu: passData.matKhauCu,
        matKhauMoi: passData.matKhauMoi,
      });

      if (res.success) {
        showToast('Đổi mật khẩu thành công!', 'success');
        setPassData({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhau: '' });
      }
    } catch (err) {
      setPassError(err.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* TỔNG QUAN TÀI KHOẢN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Thông tin tài khoản</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem và quản lý thông tin định danh của bạn trong hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-400">Email đăng ký</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Vai trò hệ thống</p>
              <Badge variant={user?.vaiTro === 'ADMIN' ? 'admin' : 'default'} className="mt-0.5">
                {user?.vaiTro === 'ADMIN' ? 'QUẢN TRỊ VIÊN' : 'SINH VIÊN'}
              </Badge>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Trạng thái gói</p>
              {isPro ? (
                <div>
                  <Badge variant="pro">PRO ĐANG KÍCH HOẠT</Badge>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hết hạn: {new Date(user.ngayHetHanPro).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ) : (
                <Badge variant="default">Gói miễn phí (FREE)</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FORM CẬP NHẬT HỌ TÊN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cập nhật họ tên hiển thị</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tên này sẽ xuất hiện trên các tài liệu và đánh giá của bạn
          </p>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Họ và tên</label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updatingProfile}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            {updatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>

      {/* FORM ĐỔI MẬT KHẨU */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Đổi mật khẩu bảo mật</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nên sử dụng mật khẩu có ít nhất 6 ký tự kết hợp chữ và số
          </p>
        </div>

        {passError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-800 text-xs max-w-lg">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu hiện tại</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passData.matKhauCu}
              onChange={(e) => setPassData({ ...passData, matKhauCu: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={passData.matKhauMoi}
              onChange={(e) => setPassData({ ...passData, matKhauMoi: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={passData.xacNhanMatKhau}
              onChange={(e) => setPassData({ ...passData, xacNhanMatKhau: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            {changingPass ? 'Đang cập nhật mật khẩu...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;

