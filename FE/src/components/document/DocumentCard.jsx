import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Star, User } from 'lucide-react';

const DocumentCard = ({ document }) => {
  if (!document) return null;

  const {
    maTaiLieu,
    tenTaiLieu,
    soTrang,
    luotTai,
    diemTrungBinh,
    soDanhGia,
    MonHoc,
    LoaiTaiLieu,
    nguoiDang,
  } = document;

  return (
    <Link
      to={`/documents/${maTaiLieu}`}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-primary-300 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 font-semibold truncate max-w-[150px]">
            {MonHoc?.tenMonHoc || 'Môn học'}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            {LoaiTaiLieu?.tenLoai || 'Tài liệu'}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-800 group-hover:text-primary-600 line-clamp-2 leading-snug transition-colors mb-2">
          {tenTaiLieu}
        </h4>

        {/* Meta info: So trang */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-4">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>{soTrang ? `${soTrang} trang PDF` : 'PDF'}</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Author */}
        <div className="flex items-center space-x-1.5 truncate max-w-[130px]">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
            {nguoiDang?.hoTen ? nguoiDang.hoTen.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="truncate">{nguoiDang?.hoTen || 'Người dùng'}</span>
        </div>

        {/* Rating & Downloads */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{diemTrungBinh ? parseFloat(diemTrungBinh).toFixed(1) : '5.0'}</span>
            <span className="text-slate-400 font-normal">({soDanhGia || 0})</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <Download className="w-3.5 h-3.5" />
            <span>{luotTai || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DocumentCard;

