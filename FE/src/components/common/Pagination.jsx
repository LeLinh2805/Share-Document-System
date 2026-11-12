import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      {/* Nút Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Trang đầu nếu cách xa */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-slate-400">...</span>}
        </>
      )}

      {/* Dãy trang ở giữa */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
            p === currentPage
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {p}
        </button>
      ))}

      {/* Trang cuối nếu cách xa */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

