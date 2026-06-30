import axiosInstance from "../utils/axiosInstance";

export const complaintService = {
  // Get all complaints
  getComplaints: () =>
    axiosInstance.get("teachers/complaints/").then((res) => res.data),

  // Create complaint
  createComplaint: (data) =>
    axiosInstance.post("teachers/complaints/", data).then((res) => res.data),

  // Update complaint
  updateComplaint: (id, data) =>
    axiosInstance.patch(`teachers/complaints/${id}/`, data).then((res) => res.data),

  // Delete complaint
  deleteComplaint: (id) =>
    axiosInstance.delete(`teachers/complaints/${id}/`).then((res) => res.data),
};
