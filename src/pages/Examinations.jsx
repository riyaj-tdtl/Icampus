import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { examService } from '../services/exam.service';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Examinations = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedExams,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(exams);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await examService.getAll();
      setExams(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Remove Examination?', 'This will permanently delete the exam record.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await examService.delete(id);
          showSuccess('Removed!', 'The examination record has been deleted.');
          fetchExams();
        } catch (error) {
          console.error('Failed to delete exam:', error);
          showError('Deletion Failed', error.response?.data?.detail || 'An error occurred while deleting the exam.');
        }
      }
    });
  };

  const handleEdit = async (exam) => {
    try {
      const data = await examService.getById(exam.id);
      
      showComplexForm(`Update Examination #${data.id}`, [
        { id: 'exam_name', label: 'Exam Name', value: data.exam_name, placeholder: 'e.g. Mathematics Mid-Term' },
        { id: 'subject', label: 'Subject', value: data.subject, placeholder: 'e.g. Mathematics' },
        { id: 'academic_class', label: 'Class', value: data.academic_class?.toString(), placeholder: 'e.g. 1', type: 'number' },
        { id: 'exam_date', label: 'Date', value: data.exam_date ? data.exam_date.split('T')[0] : '', type: 'date' },
        { id: 'total_marks', label: 'Total Marks', value: data.total_marks?.toString(), placeholder: 'e.g. 100', type: 'number' },
        { id: 'description', label: 'Description', value: data.description, placeholder: 'e.g. Mid Exam' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await examService.patch(data.id, {
              exam_name: res.value.exam_name,
              subject: res.value.subject,
              academic_class: parseInt(res.value.academic_class),
              exam_date: res.value.exam_date,
              total_marks: parseFloat(res.value.total_marks),
              description: res.value.description
            });
            showSuccess('Exam Updated!', `Details for ${res.value.exam_name} have been saved.`);
            fetchExams();
          } catch (err) {
            console.error('Failed to update exam:', err);
            showError('Update Failed', err.response?.data?.detail || 'An error occurred while saving the exam.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch exam details:', error);
      showError('Fetch Failed', 'Could not retrieve exam details from the backend.');
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
            {isStudent ? 'My Examinations' : 'Examinations'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'View your upcoming exams and test schedules.' : 'Schedule and monitor campus-wide examinations.'}
          </Typography>
        </Box>
        {!isStudent && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={() => {
              showComplexForm('Create New Examination', [
                { id: 'exam_name', label: 'Exam Name', placeholder: 'e.g. Mathematics Mid-Term' },
                { id: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics' },
                { id: 'academic_class', label: 'Class', placeholder: 'e.g. 1', type: 'number' },
                { id: 'exam_date', label: 'Date', type: 'date' },
                { id: 'total_marks', label: 'Total Marks', placeholder: 'e.g. 100', type: 'number' },
                { id: 'description', label: 'Description', placeholder: 'e.g. Mid Exam' }
              ]).then(async (res) => {
                if (res.isConfirmed && res.value) {
                  try {
                    await examService.create({
                      exam_name: res.value.exam_name,
                      subject: res.value.subject,
                      academic_class: parseInt(res.value.academic_class),
                      exam_date: res.value.exam_date,
                      total_marks: parseFloat(res.value.total_marks),
                      description: res.value.description
                    });
                    showSuccess('Exam Created!', `${res.value.exam_name} has been scheduled.`);
                    fetchExams();
                  } catch (err) {
                    console.error('Failed to create exam:', err);
                    showError('Creation Failed', err.response?.data?.detail || 'An error occurred while creating the exam.');
                  }
                }
              })
            }}
          >
            Create Exam
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Exam Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Total Marks</TableCell>
              {!isStudent && <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={8} rows={5} />
            ) : exams.length > 0 ? (
              paginatedExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{exam.exam_name}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>Class {exam.academic_class}</TableCell>
                  <TableCell>{exam.exam_date}</TableCell>
                  <TableCell>{exam.description}</TableCell>
                  <TableCell>{exam.total_marks}</TableCell>
                  {!isStudent && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Edit Exam">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f1f5f9', 
                              color: '#475569', 
                              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                            }}
                            onClick={() => handleEdit(exam)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Exam">
                          <IconButton 
                            size="small" 
                            color="error" 
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            onClick={() => handleDelete(exam.id)}
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
              <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>No exams found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={exams.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Examinations;
