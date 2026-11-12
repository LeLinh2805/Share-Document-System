import axiosClient from './axiosClient';

const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  getUsers: () => axiosClient.get('/admin/users'),
  getPendingDocuments: () => axiosClient.get('/admin/documents/pending'),
  approveDocument: (id) => axiosClient.put(`/admin/documents/${id}/approve`),
  rejectDocument: (id, lyDo) => axiosClient.put(`/admin/documents/${id}/reject`, { lyDo }),
};

export default adminApi;

