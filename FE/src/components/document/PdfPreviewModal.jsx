import React, { useState, useEffect } from 'react';
import { X, Crown, AlertCircle, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import documentApi from '../../api/documentApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const PdfPreviewModal = ({ isOpen, onClose, documentId, documentTitle }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isPro } = useAuth();

  useEffect(() => {
    let currentBlobUrl = null;

    if (isOpen && documentId) {
      setLoading(true);
      setError(null);

      documentApi
        .getPdfBlob(documentId)
        .then(({ blob, isPreview }) => {
          const url = window.URL.createObjectURL(blob);
          currentBlobUrl = url;
          setPdfUrl(url);
          setIsPreview(isPreview);
        })
        .catch((err) => {
          setError(err.message || 'Không thể tải nội dung PDF');
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      if (currentBlobUrl) {
        window.URL.revokeObjectURL(currentBlobUrl);
      }
      setPdfUrl(null);
    };
  }, [isOpen, documentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5 truncate max-w-[80%]">
            <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">
              {documentTitle || 'Xem trước tài liệu'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo nếu là bản xem trước 3 trang đầu */}
        {isPreview && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm text-amber-900">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Bạn đang xem <strong>3 trang đầu</strong> (Bản xem trước).
              </span>
            </div>
            <Link
              to="/pro"
              className="font-bold underline text-amber-700 hover:text-amber-800 ml-4 flex-shrink-0"
            >
              Nâng cấp PRO để đọc toàn bộ & Tải về →
            </Link>
          </div>
        )}

        {/* Content PDF Viewer */}
        <div className="flex-1 bg-slate-100 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <LoadingSpinner size="lg" text="Đang xử lý và tải tệp PDF..." />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-2">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Đóng cửa sổ
              </button>
            </div>
          )}

          {pdfUrl && !loading && !error && (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-full border-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;

