import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import {
  AlertTriangle,
  Shield,
  Clock,
  User,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import { complaintService } from "../services/complaint.service";
import { parentService } from "../services/parent.service";
import { useAuth } from "../context/AuthContext";
import {
  showComplexForm,
  confirmDelete,
  showSuccess,
  showError,
} from "../utils/swalUtils";
import Swal from "sweetalert2";

const severityConfig = {
  HIGH: { color: "#ef4444", bg: "#fef2f2", label: "High" },
  MEDIUM: { color: "#f59e0b", bg: "#fffbeb", label: "Medium" },
  LOW: { color: "#3b82f6", bg: "#f0f9ff", label: "Low" },
};

const statusConfig = {
  PENDING: { color: "#f59e0b", bg: "#fffbeb", label: "Pending" },
  RESOLVED: { color: "#10b981", bg: "#f0fdf4", label: "Resolved" },
  DISMISSED: { color: "#94a3b8", bg: "#f8fafc", label: "Dismissed" },
};

const Complaints = () => {
  const { role } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  // Check if user has CRUD permissions (Admin or Teacher)
  const canManage = ["ADMIN", "SUPER_ADMIN", "TEACHER"].includes(role);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await complaintService.getComplaints();
      setComplaints(result?.data || result?.results || []);

      if (canManage) {
        const ddResult = await parentService.getStudentsDropdown();
        setStudents(ddResult?.data || ddResult || []);
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleAddEdit = async (complaint = null) => {
    const isEdit = !!complaint;

    // Safely get students array
    const studentList = Array.isArray(students)
      ? students
      : students?.results || students?.data || [];

    // Prepare student options for dropdown
    const studentOptions = studentList
      .map(
        (s) =>
          `<option value="${s.id}" ${complaint?.student === s.id ? "selected" : ""}>${s.name || s.first_name + " " + s.last_name} (ID: ${s.id})</option>`,
      )
      .join("");

    const html = `
      <form id="complaint-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 16px; text-align: left; padding: 8px 0;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Student</label>
          <select id="swal-student" style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s; outline: none;"
            onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
            onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'">
            <option value="">Select Student</option>
            ${studentOptions}
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Title</label>
          <input id="swal-title" type="text" placeholder="e.g. Using Mobile Phone" value="${complaint?.title || ""}"
            style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s; outline: none;"
            onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
            onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'">
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Description</label>
          <textarea id="swal-desc" placeholder="Detailed description..." style="width: 100%; height: 100px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 12px 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s; outline: none; resize: none;"
            onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
            onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'">${complaint?.description || ""}</textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Severity</label>
            <select id="swal-severity" style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s; outline: none;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'">
              <option value="LOW" ${complaint?.severity === "LOW" ? "selected" : ""}>Low</option>
              <option value="MEDIUM" ${complaint?.severity === "MEDIUM" ? "selected" : ""}>Medium</option>
              <option value="HIGH" ${complaint?.severity === "HIGH" ? "selected" : ""}>High</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Status</label>
            <select id="swal-status" style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s; outline: none;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'">
              <option value="PENDING" ${complaint?.status === "PENDING" ? "selected" : ""}>Pending</option>
              <option value="RESOLVED" ${complaint?.status === "RESOLVED" ? "selected" : ""}>Resolved</option>
              <option value="DISMISSED" ${complaint?.status === "DISMISSED" ? "selected" : ""}>Dismissed</option>
            </select>
          </div>
        </div>
      </form>
    `;

    const result = await Swal.fire({
      title: `<div style="text-align: left; font-weight: 800; color: #1e293b; font-size: 1.25rem;">${isEdit ? "Edit" : "Add"} <span style="color: #8456f1;">Complaint</span></div>`,
      html,
      showCancelButton: true,
      confirmButtonText: isEdit ? "Save Changes" : "Create Complaint",
      confirmButtonColor: "#8456f1",
      cancelButtonColor: "#94a3b8",
      customClass: {
        popup: "premium-swal-popup",
        confirmButton: "premium-swal-confirm",
        cancelButton: "premium-swal-cancel",
      },
      preConfirm: () => {
        const student = document.getElementById("swal-student").value;
        const title = document.getElementById("swal-title").value;
        const description = document.getElementById("swal-desc").value;
        const severity = document.getElementById("swal-severity").value;
        const status = document.getElementById("swal-status").value;

        if (!student || !title || !description) {
          Swal.showValidationMessage(
            "Student, Title, and Description are required",
          );
          return false;
        }

        return {
          student: parseInt(student, 10),
          title,
          description,
          severity,
          status,
        };
      },
    });

    if (result.isConfirmed) {
      try {
        if (isEdit) {
          await complaintService.updateComplaint(complaint.id, result.value);
          showSuccess("Complaint updated successfully!");
        } else {
          await complaintService.createComplaint(result.value);
          showSuccess("Complaint created successfully!");
        }
        fetchData();
      } catch (err) {
        showError(err.response?.data?.message || "Failed to save complaint");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await confirmDelete(
      "Delete Complaint?",
      "This cannot be undone.",
    );
    if (confirm.isConfirmed) {
      try {
        await complaintService.deleteComplaint(id);
        showSuccess("Complaint deleted!");
        fetchData();
      } catch (err) {
        showError("Failed to delete complaint");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ pb: 4 }}>
        <Skeleton
          variant="text"
          width={280}
          height={36}
          animation="wave"
          sx={{ mb: 1 }}
        />
        <Skeleton
          variant="text"
          width={400}
          height={20}
          animation="wave"
          sx={{ mb: 4 }}
        />
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ borderRadius: "20px" }}
          animation="wave"
        />
      </Box>
    );
  }

  const highCount = complaints.filter((c) => c.severity === "HIGH").length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Disciplinary Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage complaints and behavioral reports.
          </Typography>
        </Box>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => handleAddEdit()}
            sx={{
              bgcolor: "#8456f1",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 1,
              boxShadow: "0 4px 14px rgba(132, 86, 241, 0.4)",
              "&:hover": { bgcolor: "#7344e3", transform: "translateY(-2px)" },
              transition: "all 0.2s",
            }}
          >
            Add Complaint
          </Button>
        )}
      </Box>

      {/* Summary Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <Box
          sx={{
            p: 2,
            bgcolor: "#fef2f2",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flex: 1,
            minWidth: 160,
          }}
        >
          <AlertTriangle size={22} color="#ef4444" />
          <Box>
            <Typography
              sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}
            >
              Total Complaints
            </Typography>
            <Typography
              sx={{ fontWeight: 900, color: "#ef4444", fontSize: "1.3rem" }}
            >
              {complaints.length}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Complaints Table */}
      {complaints.length > 0 ? (
        <Paper
          sx={{
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Student
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Complaint
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Teacher
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Date
                  </TableCell>
                  {canManage && (
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 800,
                        color: "#64748b",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => {
                  const sev =
                    severityConfig[complaint.severity] || severityConfig.LOW;
                  const stat =
                    statusConfig[complaint.status] || statusConfig.PENDING;
                  return (
                    <TableRow
                      key={complaint.id}
                      hover
                      sx={{ transition: "all 0.2s" }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "10px",
                              bgcolor: "#f0ebff",
                              color: "#8456f1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.85rem",
                            }}
                          >
                            {complaint.student_name?.charAt(0)?.toUpperCase()}
                          </Box>
                          <Typography
                            sx={{ fontWeight: 700, color: "#0f172a" }}
                          >
                            {complaint.student_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#0f172a",
                              fontSize: "0.9rem",
                            }}
                          >
                            {complaint.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8" }}
                          >
                            {complaint.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#64748b",
                          }}
                        >
                          <User size={14} />
                          <Typography
                            sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                          >
                            {complaint.teacher_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "#64748b" }}
                        >
                          {complaint.created_at
                            ? new Date(complaint.created_at).toLocaleDateString(
                                "en",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </Typography>
                      </TableCell>
                      {canManage && (
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleAddEdit(complaint)}
                              sx={{
                                color: "#3b82f6",
                                "&:hover": { bgcolor: "#eff6ff" },
                              }}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(complaint.id)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": { bgcolor: "#fef2f2" },
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Shield size={48} color="#10b981" />
          <Typography
            variant="h6"
            sx={{ mt: 2, color: "#10b981", fontWeight: 700 }}
          >
            All Clear!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No complaints have been filed.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Complaints;
