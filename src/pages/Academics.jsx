import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { programService } from "../services/program.service";
import { showComplexForm, showSuccess, confirmDelete } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const Academics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'SUPER_ADMIN';

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await programService.getAll();
      setCourses(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Delete Course?', 'This will permanently remove the course from the curriculum.').then(res => {
      if (res.isConfirmed) {
        showSuccess('Deleted!', 'The course has been removed.');
      }
    });
  };

  const handleEdit = (program) => {
    showComplexForm(`Edit: ${program.title}`, [
      { id: 'title', label: 'Program Title', placeholder: program.title },
      { id: 'description', label: 'Description', placeholder: program.description, type: 'textarea' },
      { id: 'target_type', label: 'Target Type', placeholder: program.target_type || 'ALL' },
      { id: 'event_date', label: 'Event Date', type: 'date', value: program.event_date ? program.event_date.split('T')[0] : '' }
    ]).then(res => {
      if (res.isConfirmed && res.value) {
        showSuccess('Program Updated!', `${res.value.title} has been updated.`);
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Academic Programs</Typography>
          <Typography variant="body1" color="text.secondary">Curriculum management and program catalog.</Typography>
        </Box>
        {isAdmin && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={() => {
              showComplexForm('Add New Program', [
                { id: 'title', label: 'Program Title', placeholder: 'e.g. Science Fair' },
                { id: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
                { id: 'target_type', label: 'Target Type', placeholder: 'e.g. ALL' },
                { id: 'event_date', label: 'Event Date', type: 'date' }
              ]).then(res => {
                if (res.isConfirmed && res.value) {
                  showSuccess('Program Added!', `${res.value.title} has been added to the system.`);
                }
              })
            }}
          >
            Add Program
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Target Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Event Date</TableCell>
              {isAdmin && <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{course.title}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>
                    <Chip size="small" label={course.target_type || 'ALL'} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{course.event_date ? new Date(course.event_date).toLocaleDateString() : '-'}</TableCell>
                  {isAdmin && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Edit Program">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f1f5f9', 
                              color: '#475569', 
                              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                            }}
                            onClick={() => handleEdit(course)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Program">
                          <IconButton 
                            size="small" 
                            color="error" 
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            onClick={() => handleDelete(course.id)}
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
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No programs found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Academics;
