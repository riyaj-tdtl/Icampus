import axiosInstance from "../utils/axiosInstance";

export const parentService = {
  // Admin/Teacher: Register a parent with linked children
  register: (data) =>
    axiosInstance.post("parent/parents/", data).then((res) => res.data),

  // Admin/Teacher: Get student dropdown for child selection
  getStudentsDropdown: () =>
    axiosInstance.get("parent/studensts_dd/").then((res) => res.data),

  // Parent: Dashboard overview
  getDashboard: () =>
    axiosInstance.get("parent/dashboard/").then((res) => res.data),

  // Parent: Attendance with optional filters (student_name, month, year)
  getAttendance: (params = {}) =>
    axiosInstance.get("parent/attendance/", { params }).then((res) => res.data),

  // Parent: Homework with optional filters (student_name, date)
  getHomework: (params = {}) =>
    axiosInstance.get("parent/homework/", { params }).then((res) => res.data),

  // Parent: Timetable
  getTimetable: () =>
    axiosInstance.get("parent/timetable/").then((res) => res.data),

  // Parent: Exams
  getExams: () => axiosInstance.get("parent/exams/").then((res) => res.data),

  // Parent: Programs/Events
  getPrograms: () =>
    axiosInstance.get("parent/programs/").then((res) => res.data),

  // Parent: Complaints
  getComplaints: () =>
    axiosInstance.get("teachers/complaints/").then((res) => res.data),
};
