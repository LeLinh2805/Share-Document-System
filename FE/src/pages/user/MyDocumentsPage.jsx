import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Eye, UploadCloud, Calendar, Download, Star } from 'lucide-react';
import documentApi from '../../api/documentApi';
import { useToast } from '../../contexts/ToastContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const MyDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchMyDocs = async () => {
    try {
      setLoading(true);
      const res = await documentApi.getMyDocuments();
      if (res.success) {
        setDocuments(res.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Lỗi khi tải danh sách tài liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDocs();
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await documentApi.deleteDocument(deletingId);
      if (res.success) {
        showToast('Đã xóa tài liệu thành công!', 'success');
        setDocuments((prev) => prev.filter((d) => d.maTaiLieu !== deletingId));
      }
    } catch (err) {
      showToast(err.message || 'Không thể xóa tài liệu!', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Tài liệu đã đăng tải</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi trạng thái kiểm duyệt và các tài liệu bạn đã chia sẻ
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 transition-all self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Đăng tài liệu mới</span>
        </Link>
      </div>

      {/* Danh sách tài liệu */}
      {loading ? (
        <LoadingSpinner text="Đang tải danh sách tài liệu cá nhân..." />
      ) : documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => {
            const statusVariant =
              doc.trangThai === 'APPROVED'
                ? 'success'
                : doc.trangThai === 'PENDING'
                ? 'warning'
                : 'danger';

            const statusText =
              doc.trangThai === 'APPROVED'
                ? 'Đã duyệt (Công khai)'
                : doc.trangThai === 'PENDING'
                ? 'Đang chờ Admin duyệt'
                : 'Bị từ chối';

            return (
              <div
                key={doc.maTaiLieu}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant}>{statusText}</Badge>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {doc.MonHoc?.tenMonHoc || 'Môn học'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {doc.soTrang ? `${doc.soTrang} trang PDF` : 'PDF'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base leading-snug">
                    {doc.tenTaiLieu}
                  </h3>

                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(doc.ngayUpload).toLocaleDateString('vi-VN')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>{doc.luotTai || 0} lượt tải</span>
                    </span>
                    <span className="flex items-center space-x-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.diemTrungBinh ? parseFloat(doc.diemTrungBinh).toFixed(1) : '5.0'}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    to={`/documents/${doc.maTaiLieu}`}
                    className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => {
                      setDeletingId(doc.maTaiLieu);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-500 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Bạn chưa đăng tải tài liệu nào</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hãy chia sẻ đề cương, slide hoặc giáo trình của bạn để nhận ngay ngày sử dụng PRO miễn phí!
          </p>
          <Link
            to="/upload"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20"
          >
            Đăng tài liệu đầu tiên
          </Link>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa tài liệu"
      >
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này sẽ gỡ bỏ tài liệu khỏi thư viện học tập chung.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Hủy bỏ
          </button>
          <button
            onClick={confirmDelete}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyDocumentsPage;

