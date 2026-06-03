import axiosInstance from '../utils/axiosInstance';

export const createCrudService = (endpoint) => ({
  getAll: (params) => axiosInstance.get(`${endpoint}/`, { params }).then(res => {
    const data = res.data;
    if (Array.isArray(data)) return { results: data };
    return data;
  }),
  getById: (id) => axiosInstance.get(`${endpoint}/${id}/`).then(res => res.data),
  create: (data) => axiosInstance.post(`${endpoint}/`, data).then(res => res.data),
  update: (id, data) => axiosInstance.put(`${endpoint}/${id}/`, data).then(res => res.data),
  patch: (id, data) => axiosInstance.patch(`${endpoint}/${id}/`, data).then(res => res.data),
  delete: (id) => axiosInstance.delete(`${endpoint}/${id}/`).then(res => res.data),
});

export default axiosInstance;
