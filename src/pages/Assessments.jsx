import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import { examService as assessmentService } from '../services/exam.service';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Assessments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedAssessments,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(assessments);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAll();
      setAssessments(Array.isArray(data) ? data : data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;

    const loadAssessments = async () => {
      try {
        const data = await assessmentService.getAll();
        if (active) {
          setAssessments(Array.isArray(data) ? data : data.results || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAssessments();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = (id) => {
    confirmDelete('Remove Assessment?', 'This action cannot be undone.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await assessmentService.delete(id);
          showSuccess('Deleted!', 'The assessment record has been removed.');
          fetchAssessments();
        } catch (error) {
          console.error('Failed to delete assessment:', error);
          showError('Deletion Failed', error.response?.data?.detail || 'An error occurred.');
        }
      }
    });
  };

  const handleEdit = async (a) => {
    try {
      const data = await assessmentService.getById(a.id);
      showComplexForm(`Update: ${data.exam_name}`, [
        { id: 'exam_name', label: 'Assessment Name', value: data.exam_name, placeholder: 'e.g. Mathematics Mid-Term' },
        { id: 'subject', label: 'Subject', value: data.subject, placeholder: 'e.g. Mathematics' },
        { id: 'academic_class', label: 'Class', value: data.academic_class?.toString(), placeholder: 'e.g. 1', type: 'number' },
        { id: 'exam_date', label: 'Date', value: data.exam_date ? data.exam_date.split('T')[0] : '', type: 'date' },
        { id: 'total_marks', label: 'Total Marks', value: data.total_marks?.toString(), placeholder: '100', type: 'number' },
        { id: 'description', label: 'Description', value: data.description, placeholder: 'e.g. Mid Exam' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await assessmentService.patch(data.id, {
              exam_name: res.value.exam_name,
              subject: res.value.subject,
              academic_class: parseInt(res.value.academic_class),
              exam_date: res.value.exam_date,
              total_marks: parseFloat(res.value.total_marks),
              description: res.value.description
            });
            showSuccess('Assessment Updated!', `Details for ${res.value.exam_name} have been saved.`);
            fetchAssessments();
          } catch (err) {
            console.error('Failed to update assessment:', err);
            showError('Update Failed', err.response?.data?.detail || 'An error occurred.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch details:', error);
      showError('Fetch Failed', 'Could not retrieve details.');
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Assessments</Typography>
          <Typography variant="body1" color="text.secondary">Create and manage academic evaluations and scores.</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<Plus size={18} />} 
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
          onClick={() => {
            showComplexForm('New Assessment', [
              { id: 'exam_name', label: 'Assessment Name', placeholder: 'e.g. Mathematics Mid-Term' },
              { id: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics' },
              { id: 'academic_class', label: 'Class', placeholder: 'e.g. 1', type: 'number' },
              { id: 'exam_date', label: 'Date', type: 'date' },
              { id: 'total_marks', label: 'Total Marks', placeholder: 'e.g. 100', type: 'number' },
              { id: 'description', label: 'Description', placeholder: 'e.g. Mid Exam' }
            ]).then(async (res) => {
              if (res.isConfirmed && res.value) {
                try {
                  await assessmentService.create({
                    exam_name: res.value.exam_name,
                    subject: res.value.subject,
                    academic_class: parseInt(res.value.academic_class),
                    exam_date: res.value.exam_date,
                    total_marks: parseFloat(res.value.total_marks),
                    description: res.value.description
                  });
                  showSuccess('Assessment Created!', `The assessment '${res.value.exam_name}' has been scheduled.`);
                  fetchAssessments();
                } catch (err) {
                  console.error('Failed to create assessment:', err);
                  showError('Creation Failed', err.response?.data?.detail || 'An error occurred.');
                }
              }
            })
          }}
        >
          Create Assessment
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Assessment Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Total Marks</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={7} rows={5} />
            ) : assessments.length > 0 ? (
              paginatedAssessments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{a.exam_name}</TableCell>
                  <TableCell>{a.subject}</TableCell>
                  <TableCell>Class {a.academic_class}</TableCell>
                  <TableCell>{a.exam_date}</TableCell>
                  <TableCell>{a.total_marks}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Edit Assessment">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f1f5f9', 
                            color: '#475569', 
                            '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                          }}
                          onClick={() => handleEdit(a)}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Assessment">
                        <IconButton 
                          size="small" 
                          color="error" 
                          sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => handleDelete(a.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>No assessments found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={assessments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Assessments;
