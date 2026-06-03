import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useMediaQuery, useTheme, IconButton, Tooltip } from '@mui/material';
import { Plus, RefreshCw } from 'lucide-react';
import { notificationService } from '../services/notification.service';
import { showComplexForm, showSuccess, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Communication = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedNotifications,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(notifications);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setNotifications(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    Promise.resolve().then(fetchNotifications);
  }, []);

  const handleCreate = () => {
    showComplexForm('Create Notification', [
      { id: 'title', label: 'Title', placeholder: 'e.g. Exam Notice' },
      { id: 'message', label: 'Message', placeholder: 'e.g. Mid exams start next week', type: 'textarea' },
      { id: 'target_role', label: 'Target Role (ALL/STUDENT/TEACHER)', placeholder: 'e.g. STUDENT' },
      { id: 'target_class', label: 'Target Class (optional)', placeholder: 'e.g. 1', type: 'number' }
    ]).then(async (res) => {
      if (res.isConfirmed && res.value) {
        try {
          await notificationService.create({
            title: res.value.title,
            message: res.value.message,
            target_role: (res.value.target_role || 'ALL').toUpperCase(),
            target_class: res.value.target_class ? parseInt(res.value.target_class) : null
          });
          showSuccess('Notification Sent!', `"${res.value.title}" has been published.`);
          fetchNotifications();
        } catch (error) {
          showError('Notification Failed', error.response?.data?.detail || 'Could not publish notification.');
        }
      }
    });
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            {isStudent ? 'Announcements' : 'Communications'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'Read your messages and campus notices.' : 'Broadcast notices and manage campus announcements.'}
          </Typography>
        </Box>
        {!isStudent && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={handleCreate}
          >
            New Notification
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Target</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : notifications.length > 0 ? (
              paginatedNotifications.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.title}</TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={item.target_role || 'ALL'} size="small" variant="outlined" color="secondary" />
                      {item.target_class && <Chip label={`Class ${item.target_class}`} size="small" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.is_read ? 'Read' : 'Unread'} size="small" color={item.is_read ? 'success' : 'primary'} sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No notifications found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={notifications.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {!loading && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Refresh notifications">
            <IconButton onClick={fetchNotifications} sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default Communication;
