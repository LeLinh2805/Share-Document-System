import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Calendar, ExternalLink } from 'lucide-react';
import userApi from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DownloadHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await userApi.getDownloads();
        if (res.success) {
          setHistory(res.data || []);
        }
      } catch (err) {
        console.warn('Lỗi lấy lịch sử tải:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Lịch sử tải tài liệu</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Danh sách các tài liệu học tập bạn đã tải về máy
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải lịch sử tải về..." />
      ) : history.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div
                key={item.maLichSu}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="font-semibold text-primary-600">
                      {item.TaiLieu?.MonHoc?.tenMonHoc || 'Môn học'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Đã tải vào: {new Date(item.ngayTai).toLocaleString('vi-VN')}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-base leading-snug">
                    {item.TaiLieu?.tenTaiLieu || 'Tài liệu đã bị xóa'}
                  </h4>

                  <p className="text-xs text-slate-400">
                    {item.TaiLieu?.soTrang ? `${item.TaiLieu.soTrang} trang PDF` : 'PDF'}
                  </p>
                </div>

                {item.TaiLieu && (
                  <Link
                    to={`/documents/${item.TaiLieu.maTaiLieu}`}
                    className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <span>Xem lại tài liệu</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-500 space-y-3">
          <Download className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Chưa có lịch sử tải xuống</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Khi bạn sử dụng tài khoản PRO để tải các tệp PDF về máy, lịch sử sẽ được lưu lại tại đây để bạn tiện xem lại bất cứ lúc nào.
          </p>
          <Link
            to="/documents"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20"
          >
            Khám phá tài liệu ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default DownloadHistoryPage;

