import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Users, Pencil } from 'lucide-react';
import { employeeProfileService as employeeService } from '../services/apiService';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const HR = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Terminate Employment?', 'This will permanently remove the employee record.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await employeeService.delete(id);
          showSuccess('Removed!', 'Employee record has been deleted.');
          fetchEmployees();
        } catch (error) {
          console.error('Failed to delete employee:', error);
          showError('Deletion Failed', error.response?.data?.detail || 'An error occurred while deleting the employee record.');
        }
      }
    });
  };

  const handleEdit = async (emp) => {
    try {
      // Autofetch latest details from backend
      const data = await employeeService.getById(emp.id);
      
      showComplexForm(`Update Employee #${data.id}`, [
        { id: 'employee_code', label: 'Employee Code', value: data.employee_code, placeholder: 'e.g. EMP100' },
        { id: 'designation', label: 'Designation', value: data.designation, placeholder: 'e.g. Administrator' },
        { id: 'salary', label: 'Salary', value: data.salary?.toString(), placeholder: 'e.g. 5000', type: 'number' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await employeeService.patch(data.id, {
              employee_code: res.value.employee_code,
              designation: res.value.designation,
              salary: parseFloat(res.value.salary)
            });
            showSuccess('Profile Updated!', `HR records for Employee #${data.id} have been updated.`);
            fetchEmployees();
          } catch (err) {
            console.error('Failed to update employee:', err);
            showError('Update Failed', err.response?.data?.detail || 'An error occurred while saving the employee record.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch employee details:', error);
      showError('Fetch Failed', 'Could not retrieve employee details from the backend.');
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>HR & Employee Management</Typography>
          <Typography variant="body1" color="text.secondary">Manage staff, payroll, and leave management systems.</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<Plus size={18} />} 
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
          onClick={() => {
            showComplexForm('Register New Employee', [
              { id: 'user', label: 'User ID', placeholder: 'e.g. 2', type: 'number' },
              { id: 'employee_code', label: 'Employee Code', placeholder: 'e.g. EMP100' },
              { id: 'designation', label: 'Designation', placeholder: 'e.g. Accountant' },
              { id: 'joining_date', label: 'Joining Date', placeholder: 'YYYY-MM-DD' },
              { id: 'salary', label: 'Starting Salary', placeholder: 'e.g. 5000', type: 'number' }
            ]).then(async (res) => {
              if (res.isConfirmed && res.value) {
                try {
                  await employeeService.create({
                    user: parseInt(res.value.user),
                    employee_code: res.value.employee_code,
                    designation: res.value.designation,
                    joining_date: res.value.joining_date,
                    salary: parseFloat(res.value.salary)
                  });
                  showSuccess('Employee Registered!', `Employee ${res.value.employee_code} has been added to HR.`);
                  fetchEmployees();
                } catch (err) {
                  console.error('Failed to register employee:', err);
                  showError('Registration Failed', err.response?.data?.detail || 'An error occurred while registering the employee.');
                }
              }
            })
          }}
        >
          Add Employee
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : employees.length > 0 ? (
              employees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{e.first_name} {e.last_name}</TableCell>
                  <TableCell>{e.designation}</TableCell>
                  <TableCell>General Operations</TableCell>
                  <TableCell><Chip label="On Duty" size="small" color="primary" variant="outlined" /></TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Edit Employee">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f1f5f9', 
                            color: '#475569', 
                            '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                          }}
                          onClick={() => handleEdit(e)}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Employee">
                        <IconButton 
                          size="small" 
                          color="error" 
                          sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => handleDelete(e.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No employees found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HR;
