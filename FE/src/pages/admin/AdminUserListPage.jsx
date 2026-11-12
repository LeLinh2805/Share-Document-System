import React, { useState, useEffect } from 'react';
import { Users, Shield, Crown, CheckCircle2, XCircle, Search } from 'lucide-react';
import adminApi from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getUsers();
        if (res.success) {
          setUsers(res.data || []);
        }
      } catch (err) {
        console.warn('Lỗi lấy danh sách user:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.hoTen?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.vaiTro?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Quản lý Tài khoản Người dùng</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách tất cả sinh viên và quản trị viên đã đăng ký trên hệ thống ({users.length} tài khoản)
          </p>
        </div>

        {/* Ô tìm kiếm nhanh */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải danh sách người dùng..." />
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Mã TK</th>
                  <th className="py-3.5 px-6">Họ và tên</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Vai trò</th>
                  <th className="py-3.5 px-6">Xác thực Mail</th>
                  <th className="py-3.5 px-6">Hạn dùng Pro</th>
                  <th className="py-3.5 px-6">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => {
                  const now = new Date();
                  const isPro = u.ngayHetHanPro && new Date(u.ngayHetHanPro) > now;

                  return (
                    <tr key={u.maTK} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-500">
                        #{u.maTK}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">{u.hoTen}</td>
                      <td className="py-4 px-6 text-xs text-slate-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <Badge variant={u.vaiTro === 'ADMIN' ? 'admin' : 'default'}>
                          {u.vaiTro}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {u.emailDaXacThuc ? (
                          <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã kích hoạt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs text-amber-600 font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Chưa kích hoạt</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {isPro ? (
                          <div>
                            <Badge variant="pro">PRO</Badge>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Đến: {new Date(u.ngayHetHanPro).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Gói Free</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(u.ngayTao).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">Không tìm thấy người dùng nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminUserListPage;

