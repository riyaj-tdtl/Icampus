import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, BookOpen, Clock, CheckCircle2, Pencil } from 'lucide-react';
import { homeworkService } from '../services/homework.service';
import { showComplexForm, showSuccess, confirmDelete } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Homework = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedHomeworks,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(homeworks);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';
  const isTeacher = user.role === 'TEACHER';

  useEffect(() => { fetchHomeworks(); }, []);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      const data = await homeworkService.getAll();
      setHomeworks(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Remove Homework?', 'This will permanently delete the assignment.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await homeworkService.delete(id);
          showSuccess('Deleted!', 'Homework has been removed.');
          fetchHomeworks();
        } catch (error) {
          console.error('Failed to delete homework:', error);
        }
      }
    });
  };

  const handleEdit = async (hw) => {
    try {
      const data = await homeworkService.getById(hw.id);
      showComplexForm(`Edit: ${data.title}`, [
        { id: 'title', label: 'Title', value: data.title, placeholder: 'e.g. Calculus Integration' },
        { id: 'description', label: 'Description', value: data.description, placeholder: 'Instructions...', type: 'textarea' },
        { id: 'subject', label: 'Subject', value: data.subject, placeholder: 'e.g. Mathematics' },
        { id: 'academic_class', label: 'Class', value: data.academic_class?.toString(), type: 'number' },
        { id: 'due_date', label: 'Due Date', type: 'date', value: data.due_date ? data.due_date.split('T')[0] : '' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await homeworkService.patch(data.id, {
              title: res.value.title,
              description: res.value.description,
              subject: res.value.subject,
              academic_class: parseInt(res.value.academic_class),
              due_date: res.value.due_date
            });
            showSuccess('Updated!', `Homework "${res.value.title}" has been updated.`);
            fetchHomeworks();
          } catch (err) {
            console.error('Failed to update homework:', err);
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch homework details:', error);
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            {isStudent ? 'My Homework' : 'Homework & Assignments'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'View and submit your pending assignments.' : 'Assign and track student homework with AI-generated difficulty metrics.'}
          </Typography>
        </Box>
        {isTeacher && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, py: 1.5, px: 3, bgcolor: '#8456f1', boxShadow: '0 8px 20px rgba(132, 86, 241, 0.3)' }}
            onClick={() => {
              showComplexForm('Assign New Homework', [
                { id: 'title', label: 'Homework Title', placeholder: 'e.g. Calculus Integration' },
                { id: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics' },
                { id: 'academic_class', label: 'Class ID', placeholder: 'e.g. 1', type: 'number' },
                { id: 'description', label: 'Instructions', placeholder: 'Type homework details here...', type: 'textarea' },
                { id: 'due_date', label: 'Due Date', type: 'date' }
              ]).then(async (res) => {
                if (res.isConfirmed && res.value) {
                  try {
                    await homeworkService.create({
                      title: res.value.title,
                      subject: res.value.subject,
                      academic_class: parseInt(res.value.academic_class),
                      description: res.value.description,
                      due_date: res.value.due_date
                    });
                    showSuccess('Assigned!', `"${res.value.title}" has been assigned to the section.`);
                    fetchHomeworks();
                  } catch (err) {
                    console.error('Failed to create homework:', err);
                  }
                }
              })
            }}
          >
            Assign Homework
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', overflowX: 'auto', border: '1px solid #f1f5f9' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Homework Details</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Due Date</TableCell>
              {isTeacher && <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={5} rows={5} />
            ) : homeworks.length > 0 ? (
              paginatedHomeworks.map((hw) => (
                <TableRow key={hw.id} hover>
                  <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>#{hw.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '8px', color: '#8456f1' }}><BookOpen size={20} /></Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{hw.title}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Subject: {hw.subject}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{hw.academic_class}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569' }}>
                      <Clock size={14} />
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{hw.due_date}</Typography>
                    </Box>
                  </TableCell>
                  {isTeacher && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Edit Homework">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f1f5f9', 
                              color: '#475569', 
                              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                            }}
                            onClick={() => handleEdit(hw)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Homework">
                          <IconButton 
                            size="small" 
                            color="error" 
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            onClick={() => handleDelete(hw.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, color: 'text.secondary' }}>No homework assigned yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={homeworks.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Homework;
