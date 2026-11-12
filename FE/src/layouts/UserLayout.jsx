import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, FileText, Download, Receipt, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Badge from '../components/common/Badge';

const UserLayout = () => {
  const { user, isPro } = useAuth();

  const navItems = [
    { to: '/profile', label: 'Thông tin cá nhân', icon: User },
    { to: '/my-documents', label: 'Tài liệu đã đăng', icon: FileText },
    { to: '/downloads', label: 'Lịch sử tải tài liệu', icon: Download },
    { to: '/my-orders', label: 'Đơn hàng & Giao dịch', icon: Receipt },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar người dùng */}
        <div className="md:col-span-1 space-y-6">
          {/* Card tóm tắt user */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-primary-500/20 mb-3">
              {user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="font-bold text-slate-800 text-lg truncate">{user?.hoTen}</h3>
            <p className="text-xs text-slate-500 truncate mb-3">{user?.email}</p>
            <div className="flex justify-center">
              {isPro ? (
                <Badge variant="pro" className="flex items-center space-x-1 py-1 px-3">
                  <Crown className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Tài khoản PRO</span>
                </Badge>
              ) : (
                <Badge variant="default" className="py-1 px-3">
                  Tài khoản FREE
                </Badge>
              )}
            </div>
          </div>

          {/* Menu Điều hướng */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/profile'}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;

