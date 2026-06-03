import axiosInstance from '../utils/axiosInstance';

export const authService = {
  login: (credentials) => axiosInstance.post('login/', credentials).then(res => res.data),
  logout: () => axiosInstance.post('logout/').then(res => res.data),
  refresh: (data) => axiosInstance.post('token/refresh/', data).then(res => res.data),
  getMe: () => axiosInstance.get('me/').then(res => res.data),
};
