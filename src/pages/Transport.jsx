import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Truck, Pencil } from 'lucide-react';
import { transportRouteService } from '../services/apiService';
import { showComplexForm, showSuccess, confirmDelete } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const Transport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';

  useEffect(() => { fetchRoutes(); }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await transportRouteService.getAll();
      setRoutes(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Delete Route?', 'This will permanently remove the transport route.').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await transportRouteService.delete(id);
          showSuccess('Deleted!', 'Transport route has been removed.');
          fetchRoutes();
        } catch (error) {
          console.error('Failed to delete route:', error);
        }
      }
    });
  };

  const handleEdit = async (route) => {
    try {
      const data = await transportRouteService.getById(route.id);
      showComplexForm(`Edit: ${data.name}`, [
        { id: 'name', label: 'Route Name', value: data.name, placeholder: 'e.g. North Sector Loop' },
        { id: 'start', label: 'Start Point', value: data.start_point, placeholder: 'e.g. City Center' },
        { id: 'end', label: 'End Point', value: data.end_point, placeholder: 'e.g. North Campus' },
        { id: 'dist', label: 'Distance (KM)', value: data.optimized_distance_km?.toString(), placeholder: 'e.g. 15.5', type: 'number' }
      ]).then(async (res) => {
        if (res.isConfirmed && res.value) {
          try {
            await transportRouteService.patch(data.id, {
              name: res.value.name,
              start_point: res.value.start,
              end_point: res.value.end,
              optimized_distance_km: parseFloat(res.value.dist)
            });
            showSuccess('Route Updated!', `Details for ${res.value.name} have been saved.`);
            fetchRoutes();
          } catch (err) {
            console.error('Failed to update transport route:', err);
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch route details:', error);
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
            {isStudent ? 'My Transport' : 'Transport Management'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'View your assigned bus route and daily schedule.' : 'Monitor bus routes, vehicle tracking, and student commutes.'}
          </Typography>
        </Box>
        {!isStudent && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={() => {
              showComplexForm('Add New Route', [
                { id: 'name', label: 'Route Name', placeholder: 'e.g. North Sector Loop' },
                { id: 'start', label: 'Start Point', placeholder: 'e.g. City Center' },
                { id: 'end', label: 'End Point', placeholder: 'e.g. North Campus' },
                { id: 'dist', label: 'Distance (KM)', placeholder: 'e.g. 15.5', type: 'number', step: '0.1' }
              ]).then(async (res) => {
                if (res.isConfirmed && res.value) {
                  try {
                    await transportRouteService.create({
                      name: res.value.name,
                      start_point: res.value.start,
                      end_point: res.value.end,
                      optimized_distance_km: parseFloat(res.value.dist),
                      is_active: true
                    });
                    showSuccess('Route Added!', `${res.value.name} has been added to transport.`);
                    fetchRoutes();
                  } catch (err) {
                    console.error('Failed to create transport route:', err);
                  }
                }
              })
            }}
          >
            Add Route
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Route Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Start Point</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>End Point</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Distance</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              {!isStudent && <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={7} rows={5} />
            ) : routes.length > 0 ? (
              routes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                  <TableCell>{r.start_point}</TableCell>
                  <TableCell>{r.end_point}</TableCell>
                  <TableCell>{r.optimized_distance_km} km</TableCell>
                  <TableCell>
                    <Chip label={r.is_active ? 'Active' : 'Inactive'} size="small" color={r.is_active ? 'success' : 'default'} sx={{ borderRadius: '999px', textTransform: 'none', px: 1.5, fontWeight: 700 }} />
                  </TableCell>
                  {!isStudent && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Edit Route">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f1f5f9', 
                              color: '#475569', 
                              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                            }}
                            onClick={() => handleEdit(r)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Route">
                          <IconButton 
                            size="small" 
                            color="error" 
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            onClick={() => handleDelete(r.id)}
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
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>No transport routes found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transport;
