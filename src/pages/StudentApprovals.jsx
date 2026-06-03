import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Paper, CircularProgress, ToggleButton, ToggleButtonGroup, Tooltip, useMediaQuery, useTheme, Chip } from '@mui/material';
import { Check, X } from 'lucide-react';
import { studentApprovalsService } from '../services/studentApprovals.service';
import { showSuccess, showError, confirmAction } from '../utils/swalUtils';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const StudentApprovals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState('pending');
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    page: pendingPage,
    rowsPerPage: pendingRowsPerPage,
    paginatedRows: paginatedPending,
    handleChangePage: handlePendingPageChange,
    handleChangeRowsPerPage: handlePendingRowsPerPageChange,
  } = useTablePagination(pendingStudents);

  const {
    page: approvedPage,
    rowsPerPage: approvedRowsPerPage,
    paginatedRows: paginatedApproved,
    handleChangePage: handleApprovedPageChange,
    handleChangeRowsPerPage: handleApprovedRowsPerPageChange,
  } = useTablePagination(approvedStudents);

  const fetchData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const [pending, approved] = await Promise.all([
        studentApprovalsService.getPendingStudents(),
        studentApprovalsService.getApprovedStudents()
      ]);
      setPendingStudents(pending.data || []);
      setApprovedStudents(approved.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      showError('Failed', 'Could not load student data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(false), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (student) => {
    confirmAction('Approve Student?', `Are you sure you want to approve ${student.name}?`, 'Yes, approve!').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await studentApprovalsService.approveStudent(student.id);
          showSuccess('Approved!', `${student.name} has been approved.`);
          fetchData();
        } catch (error) {
          console.error('Failed to approve:', error);
          showError('Failed', error.response?.data?.detail || 'Could not approve student.');
        }
      }
    });
  };

  const handleReject = (student) => {
    confirmAction('Reject Student?', `Are you sure you want to reject ${student.name}?`, 'Yes, reject!').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await studentApprovalsService.rejectStudent(student.id);
          showSuccess('Rejected!', `${student.name} has been rejected.`);
          fetchData();
        } catch (error) {
          console.error('Failed to reject:', error);
          showError('Failed', error.response?.data?.detail || 'Could not reject student.');
        }
      }
    });
  };

  const currentData = view === 'pending' ? paginatedPending : paginatedApproved;

  const renderApprovalsTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: isMobile ? '12px' : '14px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: view === 'pending' ? 760 : 680 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc' }}>
            <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Class</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Guardian</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Hostel</TableCell>
            {view === 'approved' && (
              <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Status</TableCell>
            )}
            {view === 'pending' && <TableCell sx={{ fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }} align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentData.map((student) => (
            <TableRow key={student.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
              <TableCell sx={{ fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>{student.name}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{student.email}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{student.phone}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{student.class_name || student.academic_class}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{student.guardian_name}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{student.hostel_status}</TableCell>
              {view === 'approved' && (
                <TableCell>
                  <Chip label="Approved" color="success" variant="outlined" size="small" />
                </TableCell>
              )}
              {view === 'pending' && (
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Approve">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<Check size={16} />}
                        onClick={() => handleApprove(student)}
                      >
                        Approve
                      </Button>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<X size={16} />}
                        onClick={() => handleReject(student)}
                      >
                        Reject
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>
          {view === 'pending' ? 'Pending Registrations' : 'Approved Registrations'}
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => newView && setView(newView)}
          sx={{ backgroundColor: '#f0f0f0', borderRadius: '8px' }}
        >
          <ToggleButton value="pending" sx={{ px: isMobile ? 1 : 2, py: isMobile ? 0.75 : 1, fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 700 }}>
            Pending ({pendingStudents.length})
          </ToggleButton>
          <ToggleButton value="approved" sx={{ px: isMobile ? 1 : 2, py: isMobile ? 0.75 : 1, fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 700 }}>
            Approved ({approvedStudents.length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (view === 'pending' ? pendingStudents.length : approvedStudents.length) === 0 ? (
        <Paper sx={{ p: isMobile ? 3 : 4, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            No {view === 'pending' ? 'pending' : 'approved'} students found.
          </Typography>
        </Paper>
      ) : (
        renderApprovalsTable()
      )}

      {!loading && (
        view === 'pending' ? (
          pendingStudents.length > 0 && (
            <TablePaginationControls
              count={pendingStudents.length}
              page={pendingPage}
              rowsPerPage={pendingRowsPerPage}
              onPageChange={handlePendingPageChange}
              onRowsPerPageChange={handlePendingRowsPerPageChange}
            />
          )
        ) : (
          approvedStudents.length > 0 && (
            <TablePaginationControls
              count={approvedStudents.length}
              page={approvedPage}
              rowsPerPage={approvedRowsPerPage}
              onPageChange={handleApprovedPageChange}
              onRowsPerPageChange={handleApprovedRowsPerPageChange}
            />
          )
        )
      )}
    </Box>
  );
};

export default StudentApprovals;
