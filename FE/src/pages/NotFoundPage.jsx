import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-black text-slate-200">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">Trang không tồn tại</h2>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        Đường dẫn bạn đang truy cập có thể đã bị thay đổi hoặc không tồn tại trên hệ thống.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Quay về Trang chủ</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

