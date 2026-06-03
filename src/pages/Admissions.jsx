import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, FileText, Pencil } from 'lucide-react';
import { admissionApplicationService } from '../services/apiService';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const Admissions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const data = await admissionApplicationService.getAll();
      setApps(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Reject Application?', 'This application will be permanently rejected and removed.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await admissionApplicationService.delete(id);
          showSuccess('Rejected!', 'Application has been removed.');
          fetchApps();
        } catch (error) {
          console.error('Failed to reject application:', error);
          showError('Rejection Failed', error.response?.data?.detail || 'An error occurred while deleting the application.');
        }
      }
    });
  };

  const handleEdit = async (app) => {
    try {
      // Autofetch latest details from backend
      const data = await admissionApplicationService.getById(app.id);
      
      showComplexForm(`Review Application #${data.id}`, [
        { id: 'status', label: 'Decision', value: data.status, placeholder: 'SUBMITTED, APPROVED, REJECTED' },
        { id: 'scholarship_recommendation', label: 'Scholarship Recommendation', value: data.scholarship_recommendation, placeholder: 'Enter comments...', type: 'textarea' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await admissionApplicationService.patch(data.id, {
              status: res.value.status,
              scholarship_recommendation: res.value.scholarship_recommendation
            });
            showSuccess('Review Saved!', `Decision for application #${data.id} has been logged.`);
            fetchApps();
          } catch (err) {
            console.error('Failed to update application status:', err);
            showError('Review Failed', err.response?.data?.detail || 'An error occurred while saving the review.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch application details:', error);
      showError('Fetch Failed', 'Could not retrieve application details from the backend.');
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Admissions Management</Typography>
          <Typography variant="body1" color="text.secondary">Review enrollment applications and admission requirements.</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<Plus size={18} />} 
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
          onClick={() => {
            showComplexForm('New Application Entry', [
              { id: 'lead', label: 'Lead ID', placeholder: 'e.g. 1', type: 'number' },
              { id: 'application_no', label: 'Application Number', placeholder: 'e.g. APP2024001' },
              { id: 'eligibility_score', label: 'Eligibility Score (0-100)', placeholder: 'e.g. 85.0', type: 'number' },
              { id: 'status', label: 'Initial Status', placeholder: 'e.g. SUBMITTED' }
            ]).then(async (res) => {
              if (res.isConfirmed && res.value) {
                try {
                  await admissionApplicationService.create({
                    lead: parseInt(res.value.lead),
                    application_no: res.value.application_no,
                    eligibility_score: parseFloat(res.value.eligibility_score),
                    status: res.value.status
                  });
                  showSuccess('Application Logged!', `Profile for application ${res.value.application_no} is now under review.`);
                  fetchApps();
                } catch (err) {
                  console.error('Failed to create application:', err);
                  showError('Creation Failed', err.response?.data?.detail || 'An error occurred while creating the application.');
                }
              }
            })
          }}
        >
          Add Application
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Applicant Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Desired Grade</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Application Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : apps.length > 0 ? (
              apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{a.applicant_name || 'Aryan Khan'}</TableCell>
                  <TableCell>12th Grade</TableCell>
                  <TableCell>Oct 20, 2024</TableCell>
                  <TableCell><Chip label="Under Review" size="small" color="warning" variant="outlined" sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} /></TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Review Application">
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
                      <Tooltip title="Reject Application">
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
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No pending applications.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Admissions;
