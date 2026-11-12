import axiosClient from './axiosClient';

const ratingApi = {
  submitRating: (data) => axiosClient.post('/ratings', data),
  getRatings: (maTaiLieu) => axiosClient.get(`/ratings/${maTaiLieu}`),
};

export default ratingApi;

