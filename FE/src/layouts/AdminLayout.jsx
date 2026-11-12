import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { BarChart3, CheckSquare, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();

  const adminNav = [
    { to: '/admin', label: 'Tổng quan Dashboard', icon: BarChart3, end: true },
    { to: '/admin/moderation', label: 'Duyệt tài liệu (Pending)', icon: CheckSquare },
    { to: '/admin/users', label: 'Danh sách người dùng', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Admin Control Panel</h1>
            <p className="text-xs text-slate-400">Hệ thống chia sẻ tài liệu học tập UTC</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-300 hidden sm:inline-block">
            Xin chào, <strong className="text-white">{user?.hoTen}</strong>
          </span>
          <Link
            to="/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về trang chủ sinh viên</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Admin Navigation Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Menu Quản trị
              </div>
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Admin Content */}
          <div className="md:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

