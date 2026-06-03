import { createCrudService } from './api';
import axiosInstance from '../utils/axiosInstance';

export const studentService = {
  ...createCrudService('students'),
  approve: (id) => axiosInstance.patch(`students/approve/${id}/`).then(res => res.data),
  getDropdown: () => axiosInstance.get('students/dropdown/').then(res => res.data),
};
