import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Chip, useMediaQuery, useTheme } from '@mui/material';
import { Plus, Calendar, Users } from 'lucide-react';
import { programService } from '../services/program.service';
import { showComplexForm, showSuccess, showError } from '../utils/swalUtils';
import { useAuth } from '../context/AuthContext';

const Programs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const isStudent = role === 'STUDENT';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  const formatApiError = (error) => {
    const data = error.response?.data;
    if (!data) return 'An error occurred.';
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;

    return Object.entries(data)
      .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
      .join('\n');
  };

  const buildProgramPayload = (values) => {
    const targetType = (values.target_type || 'ALL').toUpperCase();

    return {
      title: values.title,
      description: values.description,
      event_date: values.event_date,
      target_type: targetType,
      academic_class: targetType === 'SPECIFIC' && values.academic_class ? parseInt(values.academic_class) : null
    };
  };

  async function fetchPrograms({ showLoading = true } = {}) {
    try {
      if (showLoading) setLoading(true);
      const data = await programService.getAll();
      setPrograms(data.results || []);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrograms({ showLoading: false });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleCreate = () => {
    showComplexForm('Create Program/Event', [
      { id: 'title', label: 'Program Title', placeholder: 'e.g. Annual Science Fair' },
      { id: 'description', label: 'Description', placeholder: 'Event details...', type: 'textarea' },
      { id: 'event_date', label: 'Event Date', type: 'date' },
      {
        id: 'target_type',
        label: 'Target Type',
        type: 'select',
        value: 'ALL',
        options: [
          { value: 'ALL', label: 'All' },
          { value: 'SPECIFIC', label: 'Specific Class' }
        ]
      },
      { id: 'academic_class', label: 'Academic Class (if SPECIFIC)', placeholder: 'e.g. 1', type: 'number', required: false }
    ]).then(async (res) => {
      if (res.isConfirmed && res.value) {
        try {
          await programService.create(buildProgramPayload(res.value));
          showSuccess('Program Created!', `"${res.value.title}" has been scheduled.`);
          fetchPrograms();
        } catch (error) {
          showError('Creation Failed', formatApiError(error));
        }
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
            Programs & Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'Discover upcoming school events and programs.' : 'Manage campus-wide programs and co-curricular activities.'}
          </Typography>
        </Box>
        {isAdmin && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={handleCreate}
          >
            Create Program
          </Button>
        )}
      </Box>

      {loading ? (
        <Typography>Loading programs...</Typography>
      ) : programs.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
              xl: 'repeat(4, minmax(0, 1fr))'
            },
            gap: 3,
            alignItems: 'stretch'
          }}
        >
          {programs.map((prog) => (
            <Box key={prog.id} sx={{ minWidth: 0 }}>
              <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%', minHeight: 182, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', flex: '1 1 auto', minWidth: 0, lineHeight: 1.25, wordBreak: 'break-word' }}>
                    {prog.title}
                  </Typography>
                  <Chip 
                    label={prog.target_type || 'ALL'} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 700, borderRadius: '8px', flexShrink: 0, mt: 0.25 }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                  {prog.description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                    <Calendar size={16} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {new Date(prog.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                  {prog.academic_class && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                      <Users size={16} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Class: {prog.academic_class}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
          <Typography variant="h6" color="text.secondary">No upcoming programs found.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Programs;
