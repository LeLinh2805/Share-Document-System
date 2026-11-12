import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle,
  Crown,
  FileText
} from 'lucide-react';
import documentApi from '../../api/documentApi';
import DocumentCard from '../../components/document/DocumentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HomePage = () => {
  const [newestDocs, setNewestDocs] = useState([]);
  const [topDownloadedDocs, setTopDownloadedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Lấy 8 tài liệu mới nhất và 4 tài liệu tải nhiều nhất
        const [newRes, topRes] = await Promise.all([
          documentApi.getDocuments({ limit: 8, page: 1 }),
          documentApi.getDocuments({ limit: 4, page: 1, sapXep: 'taiNhieu' }),
        ]);

        if (newRes.success && newRes.data) {
          setNewestDocs(newRes.data.danhSach || []);
        }
        if (topRes.success && topRes.data) {
          setTopDownloadedDocs(topRes.data.danhSach || []);
        }
      } catch (err) {
        console.warn('Lỗi tải dữ liệu trang chủ:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/documents?tuKhoa=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/documents');
    }
  };

  const popularTags = [
    'Giải tích',
    'Đại số tuyến tính',
    'Lập trình Web',
    'Cơ sở dữ liệu',
    'Cấu trúc dữ liệu',
    'Kinh tế chính trị',
  ];

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Badge sinh viên */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-700 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Nền tảng chia sẻ học liệu UTC 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Kho tài liệu học tập{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              chất lượng cao
            </span>{' '}
            cho sinh viên
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tra cứu giáo trình, slide bài giảng, đề cương ôn tập và tài liệu tham khảo chính thống. Đọc thử 3 trang miễn phí, nâng cấp PRO để xem trọn vẹn và tải về không giới hạn.
          </p>

          {/* Search Box lớn */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-primary-500/10 border border-slate-200/90 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Nhập tên môn học, tài liệu, giáo trình cần tìm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-500/20 transition-all flex items-center space-x-1.5 flex-shrink-0"
              >
                <span>Tìm kiếm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-medium">Từ khóa phổ biến:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/documents?tuKhoa=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Đọc thử 3 trang miễn phí</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tất cả sinh viên đều có thể duyệt xem nội dung tóm tắt để chọn đúng tài liệu mình cần.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Đăng bài nhận 2 ngày Pro</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Cứ mỗi tài liệu được Admin kiểm duyệt thành công, bạn được tự động tặng ngay 2 ngày sử dụng Pro.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Kiểm duyệt chất lượng</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tài liệu luôn được đội ngũ quản trị viên kiểm tra kỹ lưỡng trước khi hiển thị công khai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: TÀI LIỆU MỚI NHẤT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Tài liệu mới cập nhật
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Những học liệu vừa được kiểm duyệt và đưa lên hệ thống
            </p>
          </div>
          <Link
            to="/documents"
            className="flex items-center space-x-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Đang tải danh sách tài liệu mới..." />
        ) : newestDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newestDocs.map((doc) => (
              <DocumentCard key={doc.maTaiLieu} document={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold">Chưa có tài liệu nào được duyệt</p>
            <p className="text-xs text-slate-400 mt-1">Hãy là người đầu tiên đăng tải tài liệu học tập!</p>
          </div>
        )}
      </section>

      {/* SECTION 2: TÀI LIỆU TẢI NHIỀU NHẤT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Tài liệu được tải nhiều nhất
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Được đông đảo sinh viên đánh giá cao và sử dụng cho kỳ thi
            </p>
          </div>
          <Link
            to="/documents?sapXep=taiNhieu"
            className="flex items-center space-x-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>Xem thêm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Đang tải tài liệu phổ biến..." />
        ) : topDownloadedDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDownloadedDocs.map((doc) => (
              <DocumentCard key={doc.maTaiLieu} document={doc} />
            ))}
          </div>
        ) : null}
      </section>

      {/* CTA SECTION: PRO UPGRADE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Crown className="w-4 h-4 fill-amber-300" />
              <span>Gói Thành viên PRO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Tải tài liệu không giới hạn & Đọc toàn văn mọi giáo trình
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Trải nghiệm học tập trọn vẹn với các gói Pro linh hoạt chỉ từ 10.000đ. Xem toàn bộ file PDF và tải về lưu trữ cá nhân ngay hôm nay.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/pro"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all"
              >
                Xem các gói Pro ngay
              </Link>
              <Link
                to="/upload"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
              >
                Đăng bài nhận Pro miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

