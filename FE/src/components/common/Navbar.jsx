import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  UploadCloud,
  Crown,
  User,
  LogOut,
  ShieldAlert,
  FileText,
  Download,
  Receipt,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from './Badge';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, isPro, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Đồng bộ ô tìm kiếm Navbar với tham số URL tuKhoa
  useEffect(() => {
    const q = searchParams.get('tuKhoa');
    if (q !== null) {
      setSearchKeyword(q);
    }
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchKeyword.trim();
    if (clean) {
      navigate(`/documents?tuKhoa=${encodeURIComponent(clean)}`);
    } else {
      navigate('/documents');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
                  EduShare
                </span>
                <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md">
                  UTC
                </span>
              </div>
            </Link>
          </div>

          {/* Search bar trên Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Tìm giáo trình, slide bài giảng, môn học..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-primary-400 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-2.5 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchKeyword('');
                    if (location.pathname === '/documents') {
                      navigate('/documents');
                    }
                  }}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Xóa từ khóa"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          {/* Navigation Links trên Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/documents" className="hover:text-primary-600 transition-colors">
              Thư viện tài liệu
            </Link>
            <Link
              to="/pro"
              className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Gói Pro</span>
            </Link>
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/upload"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Đăng tài liệu</span>
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.hoTen}</p>
                        {isPro && <Badge variant="pro">PRO</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                      <Link
                        to="/my-documents"
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>Tài liệu của tôi</span>
                      </Link>
                      <Link
                        to="/downloads"
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                        <span>Lịch sử tải về</span>
                      </Link>
                      <Link
                        to="/my-orders"
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Receipt className="w-4 h-4 text-slate-400" />
                        <span>Đơn hàng & Gói Pro</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-semibold transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-indigo-600" />
                          <span>Trang quản trị (Admin)</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/20 transition-all hover:shadow-md"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm tài liệu, môn học..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="absolute left-3 top-2.5 text-slate-400 hover:text-primary-600 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Trang chủ
            </Link>
            <Link
              to="/documents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Thư viện tài liệu
            </Link>
            <Link
              to="/pro"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-amber-600 font-semibold hover:bg-amber-50"
            >
              Gói Pro
            </Link>
            <Link
              to="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-primary-600 font-semibold hover:bg-primary-50"
            >
              + Đăng tài liệu mới
            </Link>
          </nav>

          <div className="border-t border-slate-100 pt-3">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-bold text-slate-800">{user?.hoTen}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-slate-700"
                >
                  Hồ sơ cá nhân
                </Link>
                <Link
                  to="/my-documents"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-slate-700"
                >
                  Tài liệu của tôi
                </Link>
                <Link
                  to="/downloads"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-slate-700"
                >
                  Lịch sử tải về
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-slate-700"
                >
                  Đơn hàng của tôi
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-sm text-indigo-700 font-semibold"
                  >
                    Quản trị hệ thống (Admin)
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-rose-600 font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold rounded-lg border border-slate-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-primary-600 text-white"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

