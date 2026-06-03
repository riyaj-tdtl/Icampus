import axiosInstance from '../utils/axiosInstance';

export const studentApprovalsService = {
  getPendingStudents: () => 
    axiosInstance.get('students/pending-students/').then(res => res.data),
  
  getApprovedStudents: () => 
    axiosInstance.get('students/approved-students/').then(res => res.data),
  
  approveStudent: (id) => 
    axiosInstance.patch(`students/approve/${id}/`).then(res => res.data),
  
  rejectStudent: (id) => 
    axiosInstance.patch(`students/reject/${id}/`).then(res => res.data),
};
