import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Calendar, Droplets, AlertTriangle, Pencil } from 'lucide-react';
import { studentService } from '../services/student.service';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Students = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedStudents,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(students);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data.results || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete('Delete Student?', 'All data for this student will be permanently removed.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await studentService.delete(id);
          showSuccess('Deleted!', 'Student record has been removed.');
          fetchStudents();
        } catch (error) {
          console.error('Failed to delete student:', error);
          showError('Deletion Failed', error.response?.data?.detail || 'An error occurred while deleting the student record.');
        }
      }
    });
  };

  const handleApprove = (id) => {
    confirmDelete('Approve Student?', "This will mark the student's admission as active.").then(async (res) => {
      if (res.isConfirmed) {
        try {
          await studentService.approve(id);
          showSuccess('Approved!', 'Student is now active.');
          fetchStudents();
        } catch (error) {
          showError('Approval Failed', error.response?.data?.detail || 'An error occurred.');
        }
      }
    });
  };

  const handleEdit = async (student) => {
    try {
      const data = await studentService.getById(student.id);
      
      showComplexForm(`Edit: ${data.name}`, [
        { id: 'name', label: 'Name', value: data.name },
        { id: 'email', label: 'Email', value: data.email },
        { id: 'phone', label: 'Phone', value: data.phone },
        { id: 'address', label: 'Address', value: data.address },
        { id: 'guardian_name', label: 'Guardian Name', value: data.guardian_name },
        { id: 'hostel_status', label: 'Hostel Status (YES/NO)', value: data.hostel_status },
        { id: 'academic_class', label: 'Academic Class', value: data.academic_class?.toString(), type: 'number' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await studentService.patch(data.id, {
              name: res.value.name,
              email: res.value.email,
              phone: res.value.phone,
              address: res.value.address,
              guardian_name: res.value.guardian_name,
              hostel_status: res.value.hostel_status,
              academic_class: parseInt(res.value.academic_class)
            });
            showSuccess('Profile Updated!', `Details for ${res.value.name} have been saved.`);
            fetchStudents();
          } catch (err) {
            console.error('Failed to update student profile:', err);
            showError('Update Failed', err.response?.data?.detail || 'An error occurred while saving the record.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch student details:', error);
      showError('Fetch Failed', 'Could not retrieve student details from the backend.');
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: '-0.5px', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Students Directory
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Academic enrollment records and student health metrics.
          </Typography>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              py: 1.5,
              px: 3,
              bgcolor: '#8456f1',
              boxShadow: '0 8px 20px rgba(132, 86, 241, 0.3)',
              '&:hover': { bgcolor: '#7344e3' }
            }}
            onClick={() => {
              showComplexForm('New Student Enrollment', [
                { id: 'name', label: 'Full Name', placeholder: 'e.g. Navya' },
                { id: 'email', label: 'Email', placeholder: 'e.g. navya@gmail.com', type: 'email' },
                { id: 'phone', label: 'Phone', placeholder: 'e.g. 8000000001' },
                { id: 'password', label: 'Password', placeholder: 'e.g. 123456', type: 'password' },
                { id: 'academic_class', label: 'Academic Class', placeholder: 'e.g. 1', type: 'number' },
                { id: 'address', label: 'Address', placeholder: 'e.g. Lahore' },
                { id: 'guardian_name', label: 'Guardian Name', placeholder: 'e.g. Ahmed Khan' },
                { id: 'hostel_status', label: 'Hostel Status (YES/NO)', placeholder: 'e.g. YES' }
              ]).then(async (res) => {
                if (res.isConfirmed && res.value) {
                  try {
                    await studentService.create({
                      name: res.value.name,
                      email: res.value.email,
                      phone: res.value.phone,
                      password: res.value.password,
                      academic_class: parseInt(res.value.academic_class),
                      address: res.value.address,
                      guardian_name: res.value.guardian_name,
                      hostel_status: res.value.hostel_status
                    });
                    showSuccess('Enrollment Created!', `Student ${res.value.name} has been registered.`);
                    fetchStudents();
                  } catch (err) {
                    console.error('Failed to enroll student:', err);
                    showError('Enrollment Failed', err.response?.data?.detail || 'An error occurred while enrolling the student.');
                  }
                }
              })
            }}
          >
            Enroll Student
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <LinearProgress sx={{ maxWidth: 400 }} />
        </Box>
      ) : (
        // TABLE VIEW FOR ALL SCREEN SIZES - HORIZONTALLY SCROLLABLE
        <>
          <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', overflowX: 'auto', border: '1px solid #f1f5f9' }}>
            <Table sx={{ minWidth: isMobile || isTablet ? 800 : 900 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Student Details</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact Info</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Registration Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Class & Hostel</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableSkeleton cols={7} rows={5} />
                ) : students.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'all 0.2s' }}>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>{student.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{student.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{student.guardian_name ? `Guardian: ${student.guardian_name}` : ''}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>{student.email}</Typography>
                          <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>{student.phone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569' }}>
                          <Calendar size={14} />
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                            {student.created_at ? new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Class {student.academic_class}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Hostel: {student.hostel_status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.is_active ? "Active" : "Inactive"} 
                          color={student.is_active ? "success" : "default"} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 700, borderRadius: '999px', textTransform: 'none', px: 1.5 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                          {!student.is_active && (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="success" 
                              onClick={() => handleApprove(student.id)}
                              sx={{ py: 0, px: 1, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              Approve
                            </Button>
                          )}
                          <Tooltip title="Edit Student">
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: '#f1f5f9', 
                                color: '#475569', 
                                '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                              }}
                              onClick={() => handleEdit(student)}
                            >
                              <Pencil size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Student">
                            <IconButton 
                              size="small" 
                              color="error" 
                              sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 10, color: 'text.secondary' }}>
                      No students found in the current session.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {students.length > 0 && (
            <TablePaginationControls
              count={students.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Students;
