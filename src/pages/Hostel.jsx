import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Home, Pencil } from 'lucide-react';
import { hostelService } from '../services/hostel.service';
import { showComplexForm, showSuccess, confirmDelete, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import TablePaginationControls from '../components/TablePaginationControls';
import { useTablePagination } from '../hooks/useTablePagination';

const Hostel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    page,
    rowsPerPage,
    paginatedRows: paginatedHostels,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePagination(hostels);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';

  useEffect(() => { fetchHostels(); }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const data = await hostelService.getAll();
      setHostels(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Remove Hostel?', 'This will permanently delete the hostel record.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await hostelService.delete(id);
          showSuccess('Deleted!', 'Hostel record has been removed.');
          fetchHostels();
        } catch (e) { showError('Error', 'Failed to delete hostel'); }
      }
    });
  };

  const handleEdit = (hostel) => {
    showComplexForm(`Edit Hostel #${hostel.id}`, [
      { id: 'total_seats', label: 'Total Seats', value: hostel.total_seats?.toString(), type: 'number' },
      { id: 'occupied_seats', label: 'Occupied Seats', value: hostel.occupied_seats?.toString(), type: 'number' },
      { id: 'available_seats', label: 'Available Seats', value: hostel.available_seats?.toString(), type: 'number' }
    ]).then(async (res) => {
      if (res.isConfirmed && res.value) {
        try {
          await hostelService.patch(hostel.id, {
            total_seats: parseInt(res.value.total_seats),
            occupied_seats: parseInt(res.value.occupied_seats),
            available_seats: parseInt(res.value.available_seats)
          });
          showSuccess('Hostel Updated!', `Details have been saved.`);
          fetchHostels();
        } catch(e) { showError('Error', 'Failed to update hostel'); }
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
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            {isStudent ? 'My Hostel' : 'Hostel Management'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'View your room allocation and report hostel issues.' : 'Manage student accommodation, rooms, and allocations.'}
          </Typography>
        </Box>
        {!isStudent && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={() => {
              showComplexForm('Add New Hostel', [
                { id: 'total_seats', label: 'Total Seats', placeholder: 'e.g. 100', type: 'number' },
                { id: 'occupied_seats', label: 'Occupied Seats', placeholder: 'e.g. 40', type: 'number' },
                { id: 'available_seats', label: 'Available Seats', placeholder: 'e.g. 60', type: 'number' }
              ]).then(async (res) => {
                if (res.isConfirmed && res.value) {
                  try {
                    await hostelService.create({
                      total_seats: parseInt(res.value.total_seats),
                      occupied_seats: parseInt(res.value.occupied_seats),
                      available_seats: parseInt(res.value.available_seats)
                    });
                    showSuccess('Hostel Added!', `New hostel has been added to inventory.`);
                    fetchHostels();
                  } catch(e) { showError('Error', 'Failed to create hostel'); }
                }
              })
            }}
          >
            Add Hostel
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Total Seats</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Occupied Seats</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Available Seats</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              {!isStudent && <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : hostels.length > 0 ? (
              paginatedHostels.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{h.total_seats}</TableCell>
                  <TableCell>{h.occupied_seats}</TableCell>
                  <TableCell>{h.available_seats}</TableCell>
                  <TableCell>
                    <Chip label={h.available_seats > 0 ? 'Available' : 'Full'} size="small" color={h.available_seats > 0 ? 'success' : 'error'} sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} />
                  </TableCell>
                  {!isStudent && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Edit Hostel">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f1f5f9', 
                              color: '#475569', 
                              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                            }}
                            onClick={() => handleEdit(h)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Hostel">
                          <IconButton 
                            size="small" 
                            color="error" 
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            onClick={() => handleDelete(h.id)}
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
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No hostels registered.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationControls
        count={hostels.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Hostel;
