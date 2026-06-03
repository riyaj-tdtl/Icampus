import { createCrudService } from './api';
import axiosInstance from '../utils/axiosInstance';

export const attendanceService = {
  ...createCrudService('attendance'),
  getAll: (params) => axiosInstance.get('attendance/', { params }).then(res => res.data),
  getPercentage: (id) => axiosInstance.get(`attendance/percentage/${id}/`).then(res => res.data),
  teacherMark: (data) => axiosInstance.post('teacher-attendance/mark/', data).then(res => res.data),
  studentMark: (data) => axiosInstance.post('student-attendance/mark/', data).then(res => res.data),
};
