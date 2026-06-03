import { createCrudService } from './api';
import axiosInstance from '../utils/axiosInstance';

export const hostelService = {
  ...createCrudService('hostel'),
  getAllocations: () => axiosInstance.get('hostel/allocations/').then(res => res.data),
  createAllocation: (data) => axiosInstance.post('hostel/allocations/', data).then(res => res.data),
};
