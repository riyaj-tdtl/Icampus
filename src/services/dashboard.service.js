import axiosInstance from '../utils/axiosInstance';

export const dashboardService = {
  getAdminDashboard: () => axiosInstance.get('dashboard/admin/').then(res => res.data),
  getTeacherDashboard: () => axiosInstance.get('dashboard/teacher/').then(res => res.data),
  getStudentDashboard: () => axiosInstance.get('dashboard/student/').then(res => res.data),
};
