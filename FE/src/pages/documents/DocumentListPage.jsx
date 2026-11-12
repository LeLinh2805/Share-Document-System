import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import documentApi from '../../api/documentApi';
import DocumentCard from '../../components/document/DocumentCard';
import DocumentFilter from '../../components/document/DocumentFilter';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText } from 'lucide-react';

const DocumentListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc params từ URL
  const [filters, setFilters] = useState({
    tuKhoa: searchParams.get('tuKhoa') || '',
    maMonHoc: searchParams.get('maMonHoc') || '',
    maLoai: searchParams.get('maLoai') || '',
    sapXep: searchParams.get('sapXep') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
  });

  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    tongSo: 0,
    trangHienTai: 1,
    tongSoTrang: 1,
  });
  const [loading, setLoading] = useState(true);

  // Đồng bộ params từ URL khi URL thay đổi (ví dụ gõ từ Navbar)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      tuKhoa: searchParams.get('tuKhoa') || '',
      maMonHoc: searchParams.get('maMonHoc') || '',
      maLoai: searchParams.get('maLoai') || '',
      sapXep: searchParams.get('sapXep') || '',
      page: parseInt(searchParams.get('page') || '1'),
    }));
  }, [searchParams]);

  // Fetch danh sách tài liệu từ Backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await documentApi.getDocuments(filters);
        if (res.success && res.data) {
          setDocuments(res.data.danhSach || []);
          setPagination({
            tongSo: res.data.tongSo || 0,
            trangHienTai: res.data.trangHienTai || 1,
            tongSoTrang: res.data.tongSoTrang || 1,
          });
        }
      } catch (err) {
        console.warn('Lỗi lấy tài liệu:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();

    // Cập nhật URL search params
    const newParams = {};
    if (filters.tuKhoa) newParams.tuKhoa = filters.tuKhoa;
    if (filters.maMonHoc) newParams.maMonHoc = filters.maMonHoc;
    if (filters.maLoai) newParams.maLoai = filters.maLoai;
    if (filters.sapXep) newParams.sapXep = filters.sapXep;
    if (filters.page > 1) newParams.page = filters.page;
    setSearchParams(newParams);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      tuKhoa: '',
      maMonHoc: '',
      maLoai: '',
      sapXep: '',
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Thư viện tài liệu học tập</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tìm kiếm và khám phá toàn bộ tài liệu đã được kiểm duyệt bởi quản trị viên UTC
        </p>
      </div>

      {/* Filter Component */}
      <DocumentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Kết quả tài liệu */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-600">
            Tìm thấy <span className="text-primary-600 font-bold">{pagination.tongSo}</span> tài liệu
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Đang lọc danh sách tài liệu..." />
        ) : documents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.maTaiLieu} document={doc} />
              ))}
            </div>

            {/* Phân trang */}
            <Pagination
              currentPage={pagination.trangHienTai}
              totalPages={pagination.tongSoTrang}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-500">
            <FileText className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Không tìm thấy tài liệu phù hợp</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn môn học khác.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 font-semibold text-xs rounded-lg hover:bg-primary-100 transition-colors"
            >
              Xem tất cả tài liệu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentListPage;

