import axiosClient from './axiosClient';

const documentApi = {
  // Lấy danh sách tài liệu công khai
  getDocuments: (params) => axiosClient.get('/documents', { params }),

  // Lấy tài liệu cá nhân
  getMyDocuments: () => axiosClient.get('/documents/my-documents'),

  // Xem chi tiết tài liệu
  getDocumentDetail: (id) => axiosClient.get(`/documents/${id}`),

  // Upload tài liệu mới
  uploadDocument: (formData) =>
    axiosClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Đọc PDF trực tuyến
  getPdfBlob: async (id) => {
    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseURL}/documents/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.message || 'Không thể tải nội dung PDF');
    }

    const isPreview = response.headers.get('X-Is-Preview') === 'true';
    const blob = await response.blob();
    return { blob, isPreview };
  },

  // Tải file tài liệu về máy (Pro)
  downloadDocument: async (id, fileName = 'tailieu.pdf') => {
    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseURL}/documents/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.message || 'Không thể tải xuống tài liệu!');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Xóa tài liệu cá nhân
  deleteDocument: (id) => axiosClient.delete(`/documents/${id}`),
};

export default documentApi;

