import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { teacherService } from '../services/teacher.service';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Teachers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedTeachers,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(teachers);

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAll();
      setTeachers(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Remove Faculty?', 'This record will be permanently deleted from the database.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await teacherService.delete(id);
          showSuccess('Removed!', 'The teacher has been removed from the faculty list.');
          fetchTeachers();
        } catch (error) {
          console.error('Failed to remove faculty:', error);
          showError('Removal Failed', error.response?.data?.detail || 'An error occurred while deleting the record.');
        }
      }
    });
  };

  const handleEdit = async (teacher) => {
    try {
      const data = await teacherService.getById(teacher.id);
      
      showComplexForm(`Update Faculty`, [
        { id: 'name', label: 'Name', value: data.name },
        { id: 'email', label: 'Email', value: data.email },
        { id: 'phone', label: 'Phone', value: data.phone },
        { id: 'occupation', label: 'Occupation', value: data.occupation },
        { id: 'subject', label: 'Subject', value: data.subject },
        { id: 'qualification', label: 'Qualification', value: data.qualification },
        { id: 'address', label: 'Address', value: data.address },
        { id: 'assigned_classes', label: 'Assigned Classes (comma separated)', value: data.assigned_classes?.join(', ') || '' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await teacherService.patch(data.id, {
              name: res.value.name,
              email: res.value.email,
              phone: res.value.phone,
              occupation: res.value.occupation,
              subject: res.value.subject,
              qualification: res.value.qualification,
              address: res.value.address,
              assigned_classes: res.value.assigned_classes ? res.value.assigned_classes.split(',').map(n => parseInt(n.trim())) : [],
              is_active: data.is_active
            });
            showSuccess('Profile Updated!', `Faculty details for ${res.value.name} have been updated.`);
            fetchTeachers();
          } catch (err) {
            console.error('Failed to update faculty profile:', err);
            showError('Update Failed', err.response?.data?.detail || 'An error occurred while saving the record.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch faculty details:', error);
      showError('Fetch Failed', 'Could not retrieve faculty details from the backend.');
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Teachers Management</Typography>
          <Typography variant="body1" color="text.secondary">Manage faculty records and specialization profiles.</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<Plus size={18} />} 
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
          onClick={() => {
            showComplexForm('Add New Faculty Member', [
              { id: 'name', label: 'Full Name', placeholder: 'e.g. Riya' },
              { id: 'email', label: 'Email', placeholder: 'e.g. riya@icampus.com', type: 'email' },
              { id: 'phone', label: 'Phone', placeholder: 'e.g. 9000000002' },
              { id: 'password', label: 'Password', placeholder: 'e.g. 123456', type: 'password' },
              { id: 'occupation', label: 'Occupation', placeholder: 'e.g. Senior Teacher' },
              { id: 'subject', label: 'Subject', placeholder: 'e.g. Physics' },
              { id: 'qualification', label: 'Qualification', placeholder: 'e.g. MSc Physics' },
              { id: 'address', label: 'Address', placeholder: 'e.g. India' },
              { id: 'assigned_classes', label: 'Assigned Classes (comma separated)', placeholder: 'e.g. 1, 2' }
            ]).then(async (res) => {
              if (res.isConfirmed && res.value) {
                try {
                  await teacherService.create({
                    name: res.value.name,
                    email: res.value.email,
                    phone: res.value.phone,
                    password: res.value.password,
                    occupation: res.value.occupation,
                    subject: res.value.subject,
                    qualification: res.value.qualification,
                    address: res.value.address,
                    assigned_classes: res.value.assigned_classes ? res.value.assigned_classes.split(',').map(n => parseInt(n.trim())) : [],
                    is_active: true
                  });
                  showSuccess('Teacher Added!', `${res.value.name} has joined the faculty.`);
                  fetchTeachers();
                } catch (err) {
                  console.error('Failed to add teacher:', err);
                  showError('Addition Failed', err.response?.data?.detail || 'An error occurred while adding the faculty member.');
                }
              }
            })
          }}
        >
          Add Teacher
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Subject & Qual.</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Classes</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={7} rows={5} />
            ) : teachers.length > 0 ? (
              paginatedTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{teacher.name}<br/><span style={{fontWeight: 400, fontSize: '0.8rem', color: '#64748b'}}>{teacher.occupation}</span></TableCell>
                  <TableCell>{teacher.email}<br/><span style={{fontSize: '0.8rem', color: '#64748b'}}>{teacher.phone}</span></TableCell>
                  <TableCell>{teacher.subject}<br/><span style={{fontSize: '0.8rem', color: '#64748b'}}>{teacher.qualification}</span></TableCell>
                  <TableCell>{teacher.assigned_classes?.join(', ')}</TableCell>
                  <TableCell>
                    <Chip label={teacher.is_active ? 'Active' : 'Inactive'} color={teacher.is_active ? 'success' : 'default'} size="small" sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Edit Teacher">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f1f5f9', 
                            color: '#475569', 
                            '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                          }}
                          onClick={() => handleEdit(teacher)}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Teacher">
                        <IconButton 
                          size="small" 
                          color="error" 
                          sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => handleDelete(teacher.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>No teachers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={teachers.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Teachers;
