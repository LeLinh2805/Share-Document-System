import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Star,
  Eye,
  Calendar,
  User,
  Crown,
  BookOpen,
  Share2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Send
} from 'lucide-react';
import documentApi from '../../api/documentApi';
import ratingApi from '../../api/ratingApi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PdfPreviewModal from '../../components/document/PdfPreviewModal';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isPro } = useAuth();
  const { showToast } = useToast();

  const [document, setDocument] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Form đánh giá
  const [userStars, setUserStars] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchDocumentDetail = async () => {
    try {
      setLoading(true);
      const [docRes, ratingRes] = await Promise.all([
        documentApi.getDocumentDetail(id),
        ratingApi.getRatings(id).catch(() => ({ success: true, data: [] })),
      ]);

      if (docRes.success && docRes.data) {
        setDocument(docRes.data);
      }
      if (ratingRes.success && ratingRes.data) {
        setRatings(ratingRes.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Không thể tải thông tin tài liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetail();
  }, [id]);

  // Xử lý Tải xuống
  const handleDownload = async () => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để tải tài liệu!', 'info');
      navigate('/login');
      return;
    }

    if (!isPro) {
      showToast('Chỉ tài khoản PRO mới có quyền tải tài liệu về máy!', 'error');
      navigate('/pro');
      return;
    }

    try {
      setDownloading(true);
      await documentApi.downloadDocument(id, `${document.tenTaiLieu}.pdf`);
      showToast('Đang tải file xuống...', 'success');
      // Tăng số lượt tải hiển thị
      setDocument((prev) => ({ ...prev, luotTai: (prev?.luotTai || 0) + 1 }));
    } catch (err) {
      showToast(err.message || 'Không thể tải xuống!', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Xử lý gửi đánh giá
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để đánh giá tài liệu!', 'info');
      navigate('/login');
      return;
    }

    try {
      setSubmittingRating(true);
      const res = await ratingApi.submitRating({
        maTaiLieu: id,
        soSao: userStars,
      });

      if (res.success) {
        showToast('Cảm ơn bạn đã đánh giá tài liệu!', 'success');
        // Tải lại thông tin tài liệu và danh sách đánh giá
        fetchDocumentDetail();
      }
    } catch (err) {
      showToast(err.message || 'Lỗi khi gửi đánh giá', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải nội dung chi tiết..." />;
  }

  if (!document) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Tài liệu không tồn tại</h2>
        <p className="text-slate-500 mt-2 mb-6">Tài liệu có thể đã bị gỡ hoặc chưa được kiểm duyệt.</p>
        <Link
          to="/documents"
          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700"
        >
          Quay lại Thư viện
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.maTK === document.maTK;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb */}
      <nav className="text-xs font-semibold text-slate-400 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span>/</span>
        <Link to="/documents" className="hover:text-primary-600">Tài liệu</Link>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-xs">{document.tenTaiLieu}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI (2/3): THÔNG TIN CHÍNH VÀ ĐÁNH GIÁ */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" className="text-xs px-3 py-1 font-semibold">
                {document.MonHoc?.tenMonHoc || 'Môn học'}
              </Badge>
              <Badge variant="default" className="text-xs px-3 py-1">
                {document.LoaiTaiLieu?.tenLoai || 'Tài liệu'}
              </Badge>
              {document.trangThai === 'APPROVED' && (
                <Badge variant="success" className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đã kiểm duyệt</span>
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {document.tenTaiLieu}
            </h1>

            {/* Meta stats bar */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-500 py-3 border-y border-slate-100">
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Người đăng: <strong className="text-slate-700">{document.nguoiDang?.hoTen}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Số trang: <strong className="text-slate-700">{document.soTrang || 0}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Download className="w-4 h-4 text-slate-400" />
                <span>Lượt tải: <strong className="text-slate-700">{document.luotTai || 0}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Ngày đăng: {new Date(document.ngayUpload).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Mô tả tài liệu */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Mô tả nội dung
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {document.moTa ? (
                  <p className="whitespace-pre-line">{document.moTa}</p>
                ) : (
                  <p className="text-slate-400 italic">Không có mô tả chi tiết cho tài liệu này.</p>
                )}
              </div>
            </div>

            {/* Rating Summary Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-black text-amber-600">
                  {document.diemTrungBinh ? parseFloat(document.diemTrungBinh).toFixed(1) : '5.0'}
                </div>
                <div>
                  <StarRating
                    rating={Math.round(document.diemTrungBinh || 5)}
                    size="md"
                    readOnly
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Dựa trên <strong>{document.soDanhGia || 0}</strong> lượt đánh giá từ sinh viên
                  </p>
                </div>
              </div>

              {/* Form gửi đánh giá nhanh nếu không phải tác giả */}
              {!isAuthor && isLoggedIn && (
                <form
                  onSubmit={handleRatingSubmit}
                  className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs"
                >
                  <span className="text-xs font-semibold text-slate-600">Bạn chấm:</span>
                  <StarRating
                    rating={userStars}
                    size="md"
                    readOnly={false}
                    onChange={(st) => setUserStars(st)}
                  />
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    {submittingRating ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* DANH SÁCH CÁC ĐÁNH GIÁ TRƯỚC ĐÓ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Đánh giá từ cộng đồng sinh viên ({ratings.length})
            </h3>

            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rt) => (
                  <div
                    key={rt.maDanhGia}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                        {rt.TaiKhoan?.hoTen ? rt.TaiKhoan.hoTen.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {rt.TaiKhoan?.hoTen || 'Sinh viên'}
                        </p>
                        <div className="mt-1">
                          <StarRating rating={rt.soSao} size="sm" readOnly />
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rt.ngayTao).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Chưa có đánh giá nào cho tài liệu này.</p>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (1/3): KHUNG HÀNH ĐỘNG ĐỌC VÀ TẢI VỀ */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5 sticky top-24">
            <div className="text-center pb-2">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Xem & Tải tài liệu</h3>
              <p className="text-xs text-slate-400 mt-1">Định dạng file PDF chuẩn</p>
            </div>

            {/* Nút Đọc trực tuyến */}
            <button
              onClick={() => setIsPdfOpen(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all hover:shadow-lg"
            >
              <Eye className="w-4 h-4" />
              <span>Đọc trực tuyến</span>
            </button>

            {/* Nút Tải xuống */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                isPro
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-md shadow-emerald-500/20'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              {downloading ? (
                <span>Đang tải xuống...</span>
              ) : isPro ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải file gốc về máy (PRO)</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Mở khóa tải về với PRO</span>
                </>
              )}
            </button>

            {/* Quyền lợi Pro Banner */}
            {!isPro && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                  <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Quyền lợi tài khoản PRO:</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Xem trọn vẹn 100% trang PDF</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Tải về lưu trữ không giới hạn</span>
                  </li>
                </ul>
                <Link
                  to="/pro"
                  className="block text-center mt-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  Nâng cấp chỉ từ 10.000đ →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Modal Viewer */}
      <PdfPreviewModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        documentId={id}
        documentTitle={document.tenTaiLieu}
      />
    </div>
  );
};

export default DocumentDetailPage;

