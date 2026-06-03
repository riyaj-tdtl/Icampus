import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import { Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react';
import { showComplexForm, showSuccess, showError } from '../utils/swalUtils';
import { timetableService } from '../services/timetable.service';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';
import { teacherService } from '../services/teacher.service';

const Timetable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [timetables, setTimetables] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedTimetables,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(timetables);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';

  useEffect(() => {
    fetchTimetables();
    fetchTeacherOptions();
  }, []);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const data = await timetableService.getAll();
      setTimetables(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchTeacherOptions = async () => {
    try {
      const data = await teacherService.getDropdown();
      setTeacherOptions((data?.teachers || []).map((teacher) => ({ value: teacher.id, label: teacher.name })));
    } catch (error) {
      console.error('Failed to load teacher dropdown options:', error);
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
            {isStudent ? 'My Timetable' : 'Timetable'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'View your daily class schedule and room assignments.' : 'Organize and schedule academic sessions and labs.'}
          </Typography>
        </Box>
        {!isStudent && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={() => {
              if (!teacherOptions.length) {
                showError('Teacher List Unavailable', 'Please refresh the page or try again later.');
                return;
              }

              showComplexForm('Schedule New Class', [
                { id: 'academic_class', label: 'Class ID', placeholder: 'e.g. 1', type: 'number' },
                { id: 'day', label: 'Day', placeholder: 'e.g. Monday' },
                { id: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics' },
                { id: 'teacher', label: 'Teacher', type: 'select', options: teacherOptions },
                { id: 'start_time', label: 'Start Time', placeholder: '09:00:00', type: 'time' },
                { id: 'end_time', label: 'End Time', placeholder: '10:00:00', type: 'time' }
              ]).then(async res => {
                if (res.isConfirmed && res.value) {
                  try {
                    await timetableService.create({
                      academic_class: parseInt(res.value.academic_class),
                      day: res.value.day,
                      subject: res.value.subject,
                      teacher: parseInt(res.value.teacher),
                      start_time: res.value.start_time,
                      end_time: res.value.end_time
                    });
                    showSuccess('Class Scheduled!', `Subject ${res.value.subject} on ${res.value.day} has been added.`);
                    fetchTimetables();
                  } catch(e) {
                     console.error('Failed to create timetable', e);
                  }
                }
              })
            }}
          >
            Add Event
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Teacher Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Class Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Day</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={30} sx={{ color: 'primary.main' }} /></TableCell></TableRow>
            ) : timetables.length > 0 ? (
              paginatedTimetables.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t.teacher_name || t.teacher}</TableCell>
                  <TableCell>{t.class_name || t.academic_class}</TableCell>
                  <TableCell>{t.day}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{t.subject}</TableCell>
                  <TableCell>{t.start_time} - {t.end_time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No timetables found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={timetables.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Timetable;
