import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  X,
  ShieldCheck
} from 'lucide-react';
import documentApi from '../../api/documentApi';
import categoryApi from '../../api/categoryApi';
import { useToast } from '../../contexts/ToastContext';

const UploadDocumentPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [subjects, setSubjects] = useState([]);
  const [types, setTypes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    tenTaiLieu: '',
    maMonHoc: '',
    tenMonHocMoi: '',
    maLoai: '',
    moTa: '',
  });
  const [isOtherSubject, setIsOtherSubject] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Tải danh mục môn học & loại tài liệu
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoadingCategories(true);
        const [subRes, typeRes] = await Promise.all([
          categoryApi.getSubjects(),
          categoryApi.getTypes(),
        ]);
        if (subRes.success) setSubjects(subRes.data || []);
        if (typeRes.success) setTypes(typeRes.data || []);
      } catch (err) {
        showToast('Không thể tải danh mục môn học!', 'error');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  const handleFileChange = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Hệ thống chỉ chấp nhận định dạng file PDF!');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('Dung lượng file vượt quá giới hạn cho phép (tối đa 50MB)!');
      return;
    }

    setSelectedFile(file);
    // Tự động điền tên tài liệu nếu chưa nhập
    if (!formData.tenTaiLieu) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({ ...prev, tenTaiLieu: cleanName }));
    }
  };

  const handleSubjectChange = (e) => {
    const val = e.target.value;
    if (val === 'other') {
      setIsOtherSubject(true);
      setFormData((prev) => ({ ...prev, maMonHoc: 'other' }));
    } else {
      setIsOtherSubject(false);
      setFormData((prev) => ({ ...prev, maMonHoc: val, tenMonHocMoi: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn tệp PDF để tải lên!');
      return;
    }

    if (!formData.tenTaiLieu.trim() || !formData.maLoai) {
      setErrorMsg('Vui lòng điền đầy đủ Tên tài liệu và Loại tài liệu!');
      return;
    }

    if (!formData.maMonHoc) {
      setErrorMsg('Vui lòng chọn môn học của tài liệu!');
      return;
    }

    if (formData.maMonHoc === 'other' && !formData.tenMonHocMoi.trim()) {
      setErrorMsg('Vui lòng nhập tên môn học mới của tài liệu!');
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append('file', selectedFile);
      data.append('tenTaiLieu', formData.tenTaiLieu.trim());
      data.append('maMonHoc', formData.maMonHoc);
      if (formData.maMonHoc === 'other') {
        data.append('tenMonHocMoi', formData.tenMonHocMoi.trim());
      }
      data.append('maLoai', formData.maLoai);
      data.append('moTa', formData.moTa.trim());

      const res = await documentApi.uploadDocument(data);
      if (res.success) {
        showToast('Tải tài liệu lên thành công! Tài liệu đang chờ Admin kiểm duyệt.', 'success');
        navigate('/my-documents');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tải tài liệu lên!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/documents"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Thư viện</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đăng tải tài liệu học tập
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đóng góp tài liệu học tập có ích cho cộng đồng sinh viên UTC
          </p>
        </div>

        {/* Banner quyền lợi Pro */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-900 text-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-emerald-800">Quyền lợi đóng góp:</strong>
            <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
              Mỗi tài liệu hợp lệ sau khi được Quản trị viên duyệt (APPROVED), hệ thống sẽ{' '}
              <strong>tự động tặng ngay 2 ngày PRO</strong> vào tài khoản của bạn!
            </p>
          </div>
        </div>

        {/* Cảnh báo quy định học liệu */}
        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Quy định chia sẻ:</strong> Chỉ đăng tải slide bài giảng, đề cương ôn tập, giáo trình, tài liệu thực hành và tài liệu học tập hợp lệ. <strong>Tuyệt đối không chia sẻ đề thi chính thức</strong> hoặc các nội dung vi phạm quy chế học tập của nhà trường.
          </span>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên tài liệu */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tên tài liệu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Đề cương chi tiết và câu hỏi ôn tập môn Giải tích 1"
              value={formData.tenTaiLieu}
              onChange={(e) => setFormData({ ...formData, tenTaiLieu: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
              required
            />
          </div>

          {/* Chọn Môn học & Loại tài liệu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Môn học <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.maMonHoc}
                onChange={handleSubjectChange}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800"
                required
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((sub) => (
                  <option key={sub.maMonHoc} value={sub.maMonHoc}>
                    {sub.tenMonHoc}
                  </option>
                ))}
                <option value="other" className="font-semibold text-primary-600">
                  + Môn học khác (Tự nhập tên môn)...
                </option>
              </select>

              {isOtherSubject && (
                <div className="mt-2.5 space-y-1">
                  <input
                    type="text"
                    placeholder="Nhập tên môn học mới (ví dụ: Đặc tả phần mềm 2026)..."
                    value={formData.tenMonHocMoi}
                    onChange={(e) => setFormData({ ...formData, tenMonHocMoi: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 shadow-xs"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-primary-600">
                    * Hệ thống sẽ tự động thêm môn học này vào danh mục sau khi bạn tải tài liệu.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Loại tài liệu <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.maLoai}
                onChange={(e) => setFormData({ ...formData, maLoai: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800"
                required
              >
                <option value="">-- Chọn loại tài liệu --</option>
                {types.map((t) => (
                  <option key={t.maLoai} value={t.maLoai}>
                    {t.tenLoai}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vùng tải file PDF (Kéo thả) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tệp tài liệu PDF <span className="text-rose-500">*</span>
            </label>

            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-slate-300 hover:border-primary-400 bg-slate-50/50'
                }`}
                onClick={() => document.getElementById('fileUploadInput').click()}
              >
                <input
                  id="fileUploadInput"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">
                  Kéo thả file PDF vào đây hoặc{' '}
                  <span className="text-primary-600 underline">chọn từ thiết bị</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Chỉ chấp nhận file .PDF, tối đa 50MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-primary-50/70 border border-primary-200 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mô tả nội dung */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Mô tả nội dung (Tùy chọn)
            </label>
            <textarea
              rows={4}
              placeholder="Tóm tắt ngắn gọn nội dung tài liệu, phạm vi kiến thức các chương..."
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Nút gửi */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <span>Đang xử lý & Tải lên...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Gửi tài liệu kiểm duyệt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentPage;

