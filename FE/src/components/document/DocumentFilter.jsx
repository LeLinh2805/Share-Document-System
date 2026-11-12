import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import categoryApi from '../../api/categoryApi';

const DocumentFilter = ({ filters, onFilterChange, onReset }) => {
  const [subjects, setSubjects] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    // Tải danh mục Môn học và Loại tài liệu từ Backend
    const fetchCategories = async () => {
      try {
        const [subRes, typeRes] = await Promise.all([
          categoryApi.getSubjects(),
          categoryApi.getTypes(),
        ]);
        if (subRes.success) setSubjects(subRes.data || []);
        if (typeRes.success) setTypes(typeRes.data || []);
      } catch (err) {
        console.warn('Lỗi tải danh mục:', err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs mb-8 space-y-4">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên tài liệu, môn học (ví dụ: Cơ sở dữ liệu, Toán rời rạc...)..."
          value={filters.tuKhoa || ''}
          onChange={(e) => handleChange('tuKhoa', e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-800"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        {filters.tuKhoa && (
          <button
            type="button"
            onClick={() => handleChange('tuKhoa', '')}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Xóa từ khóa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hàng 2: Bộ lọc theo Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
        {/* Lọc Môn học */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Môn học</label>
          <select
            value={filters.maMonHoc || ''}
            onChange={(e) => handleChange('maMonHoc', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
          >
            <option value="">Tất cả môn học</option>
            {subjects.map((sub) => (
              <option key={sub.maMonHoc} value={sub.maMonHoc}>
                {sub.tenMonHoc}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc Loại tài liệu */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Loại tài liệu</label>
          <select
            value={filters.maLoai || ''}
            onChange={(e) => handleChange('maLoai', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
          >
            <option value="">Tất cả phân loại</option>
            {types.map((t) => (
              <option key={t.maLoai} value={t.maLoai}>
                {t.tenLoai}
              </option>
            ))}
          </select>
        </div>

        {/* Sắp xếp */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Sắp xếp theo</label>
          <select
            value={filters.sapXep || ''}
            onChange={(e) => handleChange('sapXep', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
          >
            <option value="">Mới cập nhật</option>
            <option value="taiNhieu">Lượt tải nhiều nhất</option>
            <option value="danhGiaCao">Đánh giá cao nhất</option>
          </select>
        </div>

        {/* Nút đặt lại */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilter;

