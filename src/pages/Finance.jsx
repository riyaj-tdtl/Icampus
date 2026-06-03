import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { feePlanService } from '../services/apiService';
import { showComplexForm, showSuccess, confirmDelete } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const Finance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFees(); }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const data = await feePlanService.getAll();
      setFees(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Delete Fee Record?', 'This will permanently remove the record.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await feePlanService.delete(id);
          showSuccess('Deleted!', 'The fee record has been removed.');
          fetchFees();
        } catch (error) {
          console.error('Failed to delete fee plan:', error);
        }
      }
    });
  };

  const handleEdit = async (fee) => {
    try {
      const data = await feePlanService.getById(fee.id);
      showComplexForm(`Edit: ${data.name}`, [
        { id: 'name', label: 'Fee Name', value: data.name, placeholder: 'e.g. Annual Fee' },
        { id: 'amount', label: 'Amount ($)', value: data.amount?.toString(), placeholder: 'e.g. 5000', type: 'number' },
        { id: 'frequency', label: 'Frequency', value: data.frequency, placeholder: 'e.g. YEAR' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await feePlanService.patch(data.id, {
              name: res.value.name,
              amount: parseFloat(res.value.amount),
              frequency: res.value.frequency
            });
            showSuccess('Record Updated!', `Fee record for ${res.value.name} has been updated.`);
            fetchFees();
          } catch (err) {
            console.error('Failed to update fee plan:', err);
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch fee plan details:', error);
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Finance & Fees</Typography>
          <Typography variant="body1" color="text.secondary">Monitor campus transactions and student fee statuses.</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<Plus size={18} />} 
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
          onClick={() => {
            showComplexForm('Add Fee Structure', [
              { id: 'name', label: 'Fee Name', placeholder: 'e.g. Annual Fee' },
              { id: 'amount', label: 'Amount ($)', placeholder: 'e.g. 5000', type: 'number' },
              { id: 'frequency', label: 'Frequency', placeholder: 'e.g. YEAR, MONTH, TERM' }
            ]).then(async (res) => {
              if (res.isConfirmed && res.value) {
                try {
                  await feePlanService.create({
                    name: res.value.name,
                    amount: parseFloat(res.value.amount),
                    frequency: res.value.frequency,
                    is_active: true
                  });
                  showSuccess('Record Created!', `${res.value.name} structure has been added.`);
                  fetchFees();
                } catch (err) {
                  console.error('Failed to create fee plan:', err);
                }
              }
            })
          }}
        >
          Create Fee Record
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Fee Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Frequency</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : fees.length > 0 ? (
              fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{fee.name}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>${fee.amount}</TableCell>
                  <TableCell>{fee.frequency}</TableCell>
                  <TableCell>
                    <Chip label={fee.is_active ? 'Active' : 'Inactive'} color={fee.is_active ? 'success' : 'default'} size="small" sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Edit Record">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f1f5f9', 
                            color: '#475569', 
                            '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                          }}
                          onClick={() => handleEdit(fee)}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Record">
                        <IconButton 
                          size="small" 
                          color="error" 
                          sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => handleDelete(fee.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}>No fee records found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Finance;
