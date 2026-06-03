import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, LogIn, Pencil } from 'lucide-react';
import { visitorService } from '../services/apiService';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const Visitors = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVisitors(); }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await visitorService.getAll();
      setVisitors(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Delete Entry?', 'This visitor log will be permanently removed.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await visitorService.delete(id);
          showSuccess('Deleted!', 'Visitor entry has been removed.');
          fetchVisitors();
        } catch (error) {
          console.error('Failed to delete lead:', error);
          showError('Deletion Failed', error.response?.data?.detail || 'An error occurred while deleting the lead record.');
        }
      }
    });
  };

  const handleEdit = async (lead) => {
    try {
      // Autofetch latest details from backend
      const data = await visitorService.getById(lead.id);
      
      showComplexForm(`Edit Lead: ${data.name}`, [
        { id: 'name', label: 'Lead Name', value: data.name, placeholder: 'Rahul Sharma' },
        { id: 'email', label: 'Email', value: data.email, placeholder: 'rahul@example.com', type: 'email' },
        { id: 'phone', label: 'Phone', value: data.phone, placeholder: '9876543210' },
        { id: 'status', label: 'Status', value: data.status, placeholder: 'NEW' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await visitorService.patch(data.id, {
              name: res.value.name,
              email: res.value.email,
              phone: res.value.phone,
              status: res.value.status
            });
            showSuccess('Lead Updated!', `Entry for ${res.value.name} has been saved.`);
            fetchVisitors();
          } catch (err) {
            console.error('Failed to update lead:', err);
            showError('Update Failed', err.response?.data?.detail || 'An error occurred while saving the lead.');
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
      showError('Fetch Failed', 'Could not retrieve lead details from the backend.');
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Visitor Management</Typography>
          <Typography variant="body1" color="text.secondary">Monitor and log all campus visitors and security entries.</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<Plus size={18} />} 
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
          onClick={() => {
            showComplexForm('New Admission Lead', [
              { id: 'name', label: 'Prospective Student Name', placeholder: 'e.g. Rahul Sharma' },
              { id: 'email', label: 'Email', placeholder: 'e.g. rahul@example.com', type: 'email' },
              { id: 'phone', label: 'Contact Number', placeholder: 'e.g. 9876543210' },
              { id: 'interested_program', label: 'Interested Program ID', placeholder: 'e.g. 1', type: 'number' },
              { id: 'source', label: 'Source', placeholder: 'e.g. Website, Referral' }
            ]).then(async (res) => {
              if (res.isConfirmed && res.value) {
                try {
                  await visitorService.create({
                    name: res.value.name,
                    email: res.value.email,
                    phone: res.value.phone,
                    interested_program: res.value.interested_program ? parseInt(res.value.interested_program) : null,
                    source: res.value.source,
                    status: 'NEW'
                  });
                  showSuccess('Lead Logged!', `${res.value.name} has been registered as a lead.`);
                  fetchVisitors();
                } catch (err) {
                  console.error('Failed to log lead:', err);
                  showError('Creation Failed', err.response?.data?.detail || 'An error occurred while creating the lead.');
                }
              }
            })
          }}
        >
          Add Visitor
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Lead Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Contact / Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>AI Score</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={7} rows={5} />
            ) : visitors.length > 0 ? (
              visitors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{v.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{v.phone}</Typography>
                    <Typography variant="caption" color="text.secondary">{v.email}</Typography>
                  </TableCell>
                  <TableCell>{v.source}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${v.ai_conversion_score?.toFixed(1)}%`} 
                      size="small" 
                      color={v.ai_conversion_score > 25 ? 'success' : 'warning'} 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={v.status} size="small" color="primary" sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Edit Visitor">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f1f5f9', 
                            color: '#475569', 
                            '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                          }}
                          onClick={() => handleEdit(v)}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Visitor">
                        <IconButton 
                          size="small" 
                          color="error" 
                          sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => handleDelete(v.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>No leads currently found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Visitors;
