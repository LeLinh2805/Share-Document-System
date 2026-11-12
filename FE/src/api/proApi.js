import axiosClient from './axiosClient';

const proApi = {
  getPackages: () => axiosClient.get('/pro/packages'),
  createOrder: (data) => axiosClient.post('/pro/orders', data),
  payOrder: (data) => axiosClient.post('/pro/pay', data),
  getMyOrders: () => axiosClient.get('/pro/my-orders'),
};

export default proApi;

