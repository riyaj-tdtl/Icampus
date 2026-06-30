import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Clock, Calendar } from 'lucide-react';
import { parentService } from '../../services/parent.service';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const dayColors = {
  Monday: { bg: '#f0ebff', color: '#8456f1' },
  Tuesday: { bg: '#f0f9ff', color: '#3b82f6' },
  Wednesday: { bg: '#f0fdf4', color: '#10b981' },
  Thursday: { bg: '#fffbeb', color: '#f59e0b' },
  Friday: { bg: '#fef2f2', color: '#ef4444' },
  Saturday: { bg: '#fdf4ff', color: '#d946ef' },
  Sunday: { bg: '#f8fafc', color: '#64748b' },
};

const ParentTimetable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(0);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const result = await parentService.getTimetable();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch timetable:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <Box sx={{ pb: 4 }}>
        <Skeleton variant="text" width={280} height={36} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={20} animation="wave" sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '20px' }} animation="wave" />
      </Box>
    );
  }

  const children = data?.data || [];
  const currentChild = children[selectedChild] || {};
  const timetable = currentChild.timetable || [];

  // Group by day
  const groupedByDay = {};
  timetable.forEach(entry => {
    if (!groupedByDay[entry.day]) groupedByDay[entry.day] = [];
    groupedByDay[entry.day].push(entry);
  });

  // Sort days
  const sortedDays = dayOrder.filter(d => groupedByDay[d]);

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Class Timetable
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your children's weekly class schedule.
        </Typography>
      </Box>

      {/* Child Tabs */}
      {children.length > 1 && (
        <Paper sx={{ borderRadius: '16px', mb: 3, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <Tabs
            value={selectedChild}
            onChange={(e, v) => setSelectedChild(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' },
              '& .Mui-selected': { color: '#8456f1' },
              '& .MuiTabs-indicator': { backgroundColor: '#8456f1', height: 3, borderRadius: '3px 3px 0 0' }
            }}
          >
            {children.map((child, idx) => (
              <Tab key={idx} label={`${child.student_name} (Class ${child.class_name})`} />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Student Info */}
      {currentChild.student_name && (
        <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', border: '1px solid #f1f5f9', background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            background: 'linear-gradient(135deg, #8456f1, #a88bff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: '1.1rem'
          }}>
            {currentChild.student_name?.charAt(0)?.toUpperCase()}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>{currentChild.student_name}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Class {currentChild.class_name} • Guardian: {currentChild.guardian_name || '—'}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Timetable by Day */}
      {sortedDays.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sortedDays.map(day => {
            const dc = dayColors[day] || dayColors.Monday;
            return (
              <Paper key={day} sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: dc.bg, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Calendar size={18} color={dc.color} />
                  <Typography sx={{ fontWeight: 800, color: dc.color, fontSize: '1rem' }}>{day}</Typography>
                  <Chip label={`${groupedByDay[day].length} Classes`} size="small" sx={{ ml: 'auto', bgcolor: '#fff', fontWeight: 700, borderRadius: '8px', fontSize: '0.75rem' }} />
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Time</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Subject</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Teacher</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupedByDay[day].map((entry, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569' }}>
                              <Clock size={14} />
                              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                {entry.start_time?.slice(0, 5)} – {entry.end_time?.slice(0, 5)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{entry.subject}</TableCell>
                          <TableCell sx={{ color: '#64748b', fontWeight: 500 }}>{entry.teacher}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
          <Clock size={48} color="#cbd5e1" />
          <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 700 }}>No timetable available</Typography>
          <Typography variant="body2" color="text.secondary">The timetable for this child has not been configured yet.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ParentTimetable;
