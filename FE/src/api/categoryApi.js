import axiosClient from './axiosClient';

const categoryApi = {
  getSubjects: () => axiosClient.get('/categories/subjects'),
  getTypes: () => axiosClient.get('/categories/types'),
};

export default categoryApi;

