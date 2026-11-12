import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';
import adminApi from '../../api/adminApi';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import PdfPreviewModal from '../../components/document/PdfPreviewModal';
import Badge from '../../components/common/Badge';

const AdminModerationPage = () => {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // State xem trước PDF
  const [previewDoc, setPreviewDoc] = useState(null);

  // State từ chối tài liệu
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [lyDo, setLyDo] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingDocuments();
      if (res.success) {
        setPendingDocs(res.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Lỗi khi tải danh sách chờ duyệt', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Xử lý duyệt tài liệu
  const handleApprove = async (doc) => {
    try {
      setProcessing(true);
      const res = await adminApi.approveDocument(doc.maTaiLieu);
      if (res.success) {
        showToast(
          `Đã duyệt "${doc.tenTaiLieu}" thành công! Tác giả (${doc.nguoiDang?.hoTen}) đã được cộng 2 ngày Pro.`,
          'success'
        );
        setPendingDocs((prev) => prev.filter((d) => d.maTaiLieu !== doc.maTaiLieu));
      }
    } catch (err) {
      showToast(err.message || 'Không thể duyệt tài liệu!', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Xử lý từ chối tài liệu
  const handleConfirmReject = async () => {
    if (!rejectingDoc) return;
    if (!lyDo.trim()) {
      showToast('Vui lòng nhập lý do từ chối!', 'error');
      return;
    }

    try {
      setProcessing(true);
      const res = await adminApi.rejectDocument(rejectingDoc.maTaiLieu, lyDo.trim());
      if (res.success) {
        showToast(`Đã từ chối tài liệu "${rejectingDoc.tenTaiLieu}".`, 'info');
        setPendingDocs((prev) => prev.filter((d) => d.maTaiLieu !== rejectingDoc.maTaiLieu));
        setRejectingDoc(null);
        setLyDo('');
      }
    } catch (err) {
      showToast(err.message || 'Không thể từ chối tài liệu!', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Kiểm duyệt tài liệu (PENDING)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem xét nội dung trước khi công khai lên kho tài liệu chung của sinh viên UTC
          </p>
        </div>
        <Badge variant="warning" className="text-xs px-3 py-1 font-bold">
          {pendingDocs.length} tài liệu chờ
        </Badge>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải danh sách chờ duyệt..." />
      ) : pendingDocs.length > 0 ? (
        <div className="space-y-4">
          {pendingDocs.map((doc) => (
            <div
              key={doc.maTaiLieu}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="warning">CHỜ DUYỆT</Badge>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary-50 text-primary-700">
                    {doc.MonHoc?.tenMonHoc || 'Môn học'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {doc.LoaiTaiLieu?.tenLoai || 'Loại'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {doc.soTrang ? `${doc.soTrang} trang PDF` : 'PDF'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {doc.tenTaiLieu}
                </h3>

                {doc.moTa && (
                  <p className="text-xs text-slate-500 line-clamp-2 italic">
                    "{doc.moTa}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Tác giả: <strong className="text-slate-700">{doc.nguoiDang?.hoTen}</strong> ({doc.nguoiDang?.email})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ngày tải lên: {new Date(doc.ngayUpload).toLocaleString('vi-VN')}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem nội dung PDF</span>
                </button>

                <button
                  onClick={() => handleApprove(doc)}
                  disabled={processing}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Duyệt (+2 ngày Pro)</span>
                </button>

                <button
                  onClick={() => {
                    setRejectingDoc(doc);
                    setLyDo('');
                  }}
                  disabled={processing}
                  className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Từ chối</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-500 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Hàng đợi kiểm duyệt trống!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hiện tại không có tài liệu nào đang chờ kiểm duyệt. Mọi đóng góp đã được xử lý.
          </p>
        </div>
      )}

      {/* MODAL TỪ CHỐI TÀI LIỆU */}
      <Modal
        isOpen={!!rejectingDoc}
        onClose={() => setRejectingDoc(null)}
        title="Từ chối tài liệu kèm lý do"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Bạn đang từ chối tài liệu:{' '}
            <strong className="text-slate-800">{rejectingDoc?.tenTaiLieu}</strong>
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Lý do từ chối (bắt buộc)
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Tài liệu mờ không đọc được, trùng lặp nội dung, vi phạm bản quyền..."
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setRejectingDoc(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={processing || !lyDo.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm disabled:opacity-50"
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </Modal>

      {/* PDF PREVIEW MODAL */}
      {previewDoc && (
        <PdfPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          documentId={previewDoc.maTaiLieu}
          documentTitle={previewDoc.tenTaiLieu}
        />
      )}
    </div>
  );
};

export default AdminModerationPage;

