import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">EduShare</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng chia sẻ và tra cứu tài liệu học tập dành riêng cho sinh viên đại học. Học tập dễ dàng, chia sẻ tri thức không giới hạn.
            </p>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">
                  Tất cả tài liệu
                </Link>
              </li>
              <li>
                <Link to="/documents?sapXep=taiNhieu" className="hover:text-white transition-colors">
                  Tài liệu tải nhiều nhất
                </Link>
              </li>
              <li>
                <Link to="/documents?sapXep=danhGiaCao" className="hover:text-white transition-colors">
                  Đánh giá cao nhất
                </Link>
              </li>
              <li>
                <Link to="/pro" className="hover:text-white transition-colors">
                  Nâng cấp Gói Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chính sách & Hỗ trợ */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Chính sách
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kiểm duyệt chất lượng</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Thưởng 2 ngày Pro khi đăng bài</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>hotro@edushare.utc.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Đồ án Nhóm 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Đồ án Môn học
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Học phần: Phát triển phần mềm mã nguồn mở
              <br />
              Trường Đại học Giao thông Vận tải (UTC)
              <br />
              Khoa Công nghệ Thông tin - Nhóm 4
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduShare. Mọi quyền được bảo lưu.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>cho cộng đồng sinh viên</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

