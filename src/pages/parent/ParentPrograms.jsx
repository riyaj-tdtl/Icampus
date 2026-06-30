import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Skeleton } from '@mui/material';
import { Calendar, Users } from 'lucide-react';
import { parentService } from '../../services/parent.service';

const ParentPrograms = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const result = await parentService.getPrograms();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <Box sx={{ pb: 4 }}>
        <Skeleton variant="text" width={280} height={36} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={20} animation="wave" sx={{ mb: 4 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: '20px' }} animation="wave" />
          ))}
        </Box>
      </Box>
    );
  }

  const children = data?.data || [];

  // Flatten all programs across children and deduplicate by id
  const allPrograms = [];
  const seenIds = new Set();
  children.forEach(child => {
    (child.programs || []).forEach(prog => {
      if (!seenIds.has(prog.id)) {
        seenIds.add(prog.id);
        allPrograms.push(prog);
      }
    });
  });

  // Sort by event_date
  allPrograms.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Programs & Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover upcoming school events and programs for your children.
        </Typography>
      </Box>

      {/* Programs Grid */}
      {allPrograms.length > 0 ? (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
          gap: 3
        }}>
          {allPrograms.map((prog) => {
            const isUpcoming = new Date(prog.event_date) >= new Date();
            return (
              <Paper
                key={prog.id}
                sx={{
                  p: 3, borderRadius: '20px', border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(132, 86, 241, 0.1)', borderColor: '#8456f133' }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.25, wordBreak: 'break-word' }}>
                    {prog.title}
                  </Typography>
                  <Chip
                    label={prog.target_type || 'ALL'}
                    size="small"
                    sx={{
                      fontWeight: 700, borderRadius: '8px', flexShrink: 0, mt: 0.25,
                      bgcolor: prog.target_type === 'CLASS' ? '#f0f9ff' : '#f0ebff',
                      color: prog.target_type === 'CLASS' ? '#3b82f6' : '#8456f1',
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                  {prog.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                    <Calendar size={16} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {new Date(prog.event_date).toLocaleDateString('en', { weekday: 'short', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                  <Chip
                    label={isUpcoming ? 'Upcoming' : 'Past'}
                    size="small"
                    sx={{
                      fontWeight: 700, borderRadius: '8px', fontSize: '0.7rem',
                      bgcolor: isUpcoming ? '#f0fdf4' : '#f8fafc',
                      color: isUpcoming ? '#10b981' : '#94a3b8',
                    }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
          <Calendar size={48} color="#cbd5e1" />
          <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 700 }}>No upcoming programs</Typography>
          <Typography variant="body2" color="text.secondary">Events will appear here once they are scheduled.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ParentPrograms;
