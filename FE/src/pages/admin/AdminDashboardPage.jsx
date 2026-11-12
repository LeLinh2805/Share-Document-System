import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn('Lỗi lấy thống kê:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Đang đồng bộ số liệu thống kê..." />;
  }

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats?.tongNguoiDung || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/users',
    },
    {
      title: 'Tài liệu chờ duyệt',
      value: stats?.tongChoDuyet || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/moderation',
      highlight: (stats?.tongChoDuyet || 0) > 0,
    },
    {
      title: 'Tài liệu đã duyệt',
      value: stats?.tongDaDuyet || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Tài liệu bị từ chối',
      value: stats?.tongBiTuChoi || 0,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Tổng kho tài liệu',
      value: stats?.tongTaiLieu || 0,
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Tổng doanh thu gói Pro',
      value: `${new Intl.NumberFormat('vi-VN').format(stats?.tongDoanhThu || 0)} đ`,
      icon: DollarSign,
      color: 'bg-teal-50 text-teal-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Tổng quan Quản trị Hệ thống
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi các chỉ số vận hành, kiểm duyệt tài liệu và doanh thu thời gian thực
        </p>
      </div>

      {/* Grid thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between ${
                card.highlight
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900">{card.value}</div>
                {card.link && (
                  <Link
                    to={card.link}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-primary-600 hover:text-primary-700 mt-3"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold">Bạn có {stats?.tongChoDuyet || 0} tài liệu đang chờ duyệt</h3>
          <p className="text-xs text-slate-300">
            Kiểm tra và phê duyệt sớm để sinh viên được thưởng ngày Pro và chia sẻ tri thức.
          </p>
        </div>
        <Link
          to="/admin/moderation"
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex-shrink-0"
        >
          Mở danh sách duyệt ngay →
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

