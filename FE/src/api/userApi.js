import axiosClient from './axiosClient';

const userApi = {
  getProfile: () => axiosClient.get('/users/profile'),
  updateProfile: (data) => axiosClient.put('/users/profile', data),
  changePassword: (data) => axiosClient.put('/users/change-password', data),
  getDownloads: () => axiosClient.get('/users/downloads'),
};

export default userApi;

