import { createCrudService } from './api';
import axiosInstance from '../utils/axiosInstance';

export const teacherService = {
  ...createCrudService('teachers'),
  getDropdown: () => axiosInstance.get('teachers/dropdown/').then(res => res.data),
};
