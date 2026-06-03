import axiosInstance from '../utils/axiosInstance';

const normalizeList = (data) => {
  if (Array.isArray(data)) return { results: data };
  return data;
};

export const notificationService = {
  getAll: (params) => axiosInstance.get('notifications/', { params }).then(res => normalizeList(res.data)),
  create: (data) => axiosInstance.post('notifications/', data).then(res => res.data),
  getUnreadCount: async () => {
    try {
      return await axiosInstance.get('notifications/unread-count/').then(res => res.data);
    } catch {
      const data = await axiosInstance.get('notifications/').then(res => normalizeList(res.data));
      return { unread_notifications: (data.results || []).filter((item) => !item.is_read).length };
    }
  },
};
