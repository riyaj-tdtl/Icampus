import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import { Plus } from "lucide-react";
import { attendanceService } from "../services/attendance.service";
import { teacherService } from "../services/teacher.service";
import { studentService } from "../services/student.service";
import { showComplexForm, showSuccess, showError } from "../utils/swalUtils";
import TableSkeleton from "../components/TableSkeleton";
import TablePaginationControls from "../components/TablePaginationControls";
import { useTablePagination } from "../hooks/useTablePagination";

const AttendancePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [studentRecords, setStudentRecords] = useState([]);
  const [teacherRecords, setTeacherRecords] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;
  const isStudent = userRole === "STUDENT";
  const isTeacher = userRole === "TEACHER";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll();
      // API returns { student_attendance: [...], teacher_attendance: [...] }
      // OR it could return { results: [...] } after our wrapper if it's an array
      if (data.student_attendance) {
        setStudentRecords(data.student_attendance || []);
      } else if (data.my_attendance) {
        setStudentRecords(data.my_attendance || []);
      } else if (data.results) {
        setStudentRecords(data.results || []);
      }
      if (data.teacher_attendance) {
        setTeacherRecords(data.teacher_attendance || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const [teacherData, studentData] = await Promise.all([
        teacherService.getDropdown(),
        studentService.getDropdown(),
      ]);

      setTeacherOptions(
        (teacherData?.teachers || []).map((teacher) => ({
          value: teacher.id,
          label: teacher.name,
        })),
      );

      setStudentOptions(
        (studentData?.students || []).map((student) => ({
          value: student.id,
          label: student.name,
        })),
      );
    } catch (error) {
      console.error("Failed to load attendance dropdown options:", error);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchAttendance);
    Promise.resolve().then(fetchDropdownOptions);
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "present") return "success";
    if (s === "late") return "warning";
    return "error";
  };

  const headerCellSx = {
    fontWeight: 800,
    color: "#64748b",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    py: 2,
  };

  const bodyCellSx = {
    py: 2,
    verticalAlign: "middle",
  };

  // Admins manage teacher attendance; teachers manage student attendance.
  const availableTabs = isStudent
    ? []
    : isAdmin
      ? [
          {
            label: "Teacher Attendance",
            type: "teacher",
            count: teacherRecords.length,
          },
        ]
      : [
          {
            label: "Student Attendance",
            type: "student",
            count: studentRecords.length,
          },
        ];
  const activeTab = availableTabs[tab] || availableTabs[0];
  const isShowingStudents = isStudent || activeTab?.type === "student";
  const activeRecords = isShowingStudents ? studentRecords : teacherRecords;
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedRecords,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(activeRecords);

  const handleMarkAttendance = () => {
    const target = isAdmin ? "teacher" : "student";
    const targetLabel = isAdmin ? "Teacher" : "Student";
    const targetOptions = isAdmin ? teacherOptions : studentOptions;

    if (!targetOptions.length) {
      showError(
        "Options Unavailable",
        `Could not load ${targetLabel.toLowerCase()} list. Please try again.`,
      );
      return;
    }

    showComplexForm(`Mark ${targetLabel} Attendance`, [
      {
        id: target,
        label: `Select ${targetLabel}`,
        type: "select",
        options: targetOptions,
      },
      { id: "date", label: "Date", type: "date" },
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "Present", label: "Present" },
          { value: "Absent", label: "Absent" },
          { value: "Late", label: "Late" },
        ],
      },
    ]).then(async (res) => {
      if (res.isConfirmed && res.value) {
        try {
          const selectedPerson = targetOptions.find(
            (option) => String(option.value) === String(res.value[target]),
          );
          const payload = {
            [target]: parseInt(res.value[target]),
            date: res.value.date,
            status: res.value.status,
          };

          if (isAdmin) {
            await attendanceService.teacherMark(payload);
          } else {
            await attendanceService.studentMark(payload);
          }

          showSuccess(
            "Attendance Marked!",
            `Attendance for ${selectedPerson?.label || `${targetLabel.toLowerCase()} ID ${res.value[target]}`} has been recorded.`,
          );
          fetchAttendance();
        } catch (err) {
          showError(
            "Failed",
            err.response?.data?.detail || "Could not mark attendance",
          );
        }
      }
    });
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
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
            {isStudent
              ? "My Attendance"
              : isAdmin
                ? "Teachers Attendance Tracking"
                : "Attendance Tracking"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent
              ? "View your daily attendance and overall participation."
              : "Real-time attendance logs and participation metrics."}
          </Typography>
        </Box>
        {(isAdmin || isTeacher) && (
          <Button
            variant="contained"
            fullWidth={isMobile}
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              py: 1.5,
              px: 3,
              bgcolor: "#8456f1",
              boxShadow: "0 8px 20px rgba(132, 86, 241, 0.3)",
              "&:hover": { bgcolor: "#7344e3" },
            }}
            onClick={handleMarkAttendance}
          >
            Mark Attendance
          </Button>
        )}
      </Box>

      {/* Role-based attendance view */}
      {!isStudent && availableTabs.length > 1 && (
        <Paper
          sx={{
            borderRadius: "16px",
            mb: 3,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              px: 2,
              "& .MuiTab-root": {
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
              },
              "& .Mui-selected": { color: "#8456f1" },
              "& .MuiTabs-indicator": {
                backgroundColor: "#8456f1",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            {availableTabs.map((item) => (
              <Tab key={item.type} label={`${item.label} (${item.count})`} />
            ))}
          </Tabs>
        </Paper>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflowX: "auto",
          border: "1px solid #f1f5f9",
        }}
      >
        <Table
          sx={{
            minWidth: isStudent ? 640 : 760,
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              px: 2,
            },
          }}
        >
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              {isStudent ? (
                <>
                  <TableCell sx={{ ...headerCellSx, width: "33.33%" }}>
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ ...headerCellSx, width: "33.33%", textAlign: "center" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      textAlign: "center",
                      pl: 8,
                    }}
                  >
                    Marked By
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ ...headerCellSx, width: "10%" }}>
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      width: isShowingStudents ? "26%" : "34%",
                    }}
                  >
                    {isShowingStudents ? "Student Name" : "Teacher Name"}
                  </TableCell>
                  <TableCell sx={{ ...headerCellSx, width: "18%" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ ...headerCellSx, width: "16%", textAlign: "center" }}>
                    Status
                  </TableCell>
                  {isShowingStudents && (
                    <TableCell sx={{ ...headerCellSx, width: "30%" }}>
                      Marked By
                    </TableCell>
                  )}
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton
                cols={isStudent ? 3 : isShowingStudents ? 5 : 4}
                rows={5}
              />
            ) : activeRecords.length > 0 ? (
              paginatedRecords.map((row) => (
                <TableRow key={row.id} hover sx={{ transition: "all 0.2s" }}>
                  {isStudent ? (
                    <>
                      <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                        {row.date}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                        <Chip
                          size="small"
                          label={row.status}
                          color={getStatusColor(row.status)}
                          sx={{
                            fontWeight: 700,
                            minWidth: "85px",
                            borderRadius: "999px",
                            textTransform: "none",
                            px: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: "#475569",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {row.marked_by_name || row.marked_by || "-"}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ ...bodyCellSx, color: "#64748b", fontWeight: 600 }}>
                        #{row.id}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, fontWeight: 700, color: "#0f172a" }}>
                        {isShowingStudents
                          ? row.student_name
                          : row.teacher_name}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, fontWeight: 500 }}>{row.date}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                        <Chip
                          size="small"
                          label={row.status}
                          color={getStatusColor(row.status)}
                          sx={{
                            fontWeight: 700,
                            minWidth: "85px",
                            borderRadius: "999px",
                            textTransform: "none",
                            px: 1.5,
                          }}
                        />
                      </TableCell>
                      {isShowingStudents && (
                        <TableCell sx={{ ...bodyCellSx, color: "#64748b", fontWeight: 600 }}>
                          {row.marked_by_name || row.marked_by || "-"}
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isStudent ? 3 : isShowingStudents ? 5 : 4}
                  align="center"
                  sx={{ py: 6, color: "text.secondary" }}
                >
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={activeRecords.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AttendancePage;
