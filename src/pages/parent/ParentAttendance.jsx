import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, TextField, MenuItem, Skeleton, LinearProgress } from '@mui/material';
import { CalendarCheck, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { parentService } from '../../services/parent.service';

const ParentAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ student_name: '', month: '', year: '' });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.student_name) params.student_name = filters.student_name;
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      const result = await parentService.getAttendance(params);
      setData(result);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleFilter = () => { fetchAttendance(); };

  const children = data?.children || [];
  const childNames = [...new Set(children.map(c => c.student_name))];

  const getStatusColor = (status) => {
    return status?.toLowerCase() === 'present' ? '#10b981' : '#ef4444';
  };

  const getStatusBg = (status) => {
    return status?.toLowerCase() === 'present' ? '#f0fdf4' : '#fef2f2';
  };

  if (loading) {
    return (
      <Box sx={{ pb: 4 }}>
        <Skeleton variant="text" width={280} height={36} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={20} animation="wave" sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '20px' }} animation="wave" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Attendance Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your children's daily attendance and participation records.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Filter size={18} color="#8456f1" />
          <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Filters</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr auto' }, gap: 2, alignItems: 'end' }}>
          <TextField
            select
            size="small"
            label="Student"
            value={filters.student_name}
            onChange={(e) => setFilters(prev => ({ ...prev, student_name: e.target.value }))}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          >
            <MenuItem value="">All Children</MenuItem>
            {childNames.map(name => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Month"
            value={filters.month}
            onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          >
            <MenuItem value="">All</MenuItem>
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(2026, i).toLocaleString('en', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Year"
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          >
            <MenuItem value="">All</MenuItem>
            {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => {
              const yr = new Date().getFullYear() - i;
              return <MenuItem key={yr} value={yr}>{yr}</MenuItem>;
            })}
          </TextField>
          <Chip
            label="Apply Filters"
            onClick={handleFilter}
            sx={{
              bgcolor: '#8456f1', color: '#fff', fontWeight: 700, cursor: 'pointer',
              height: 40, borderRadius: '10px', px: 2, width: '100%',
              '&:hover': { bgcolor: '#7344e3' }
            }}
          />
        </Box>
      </Paper>

      {/* Children Attendance Cards */}
      {children.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {children.map((child) => {
            const attendanceColor = (child.attendance_percentage || 0) >= 90 ? '#10b981' : (child.attendance_percentage || 0) >= 75 ? '#f59e0b' : '#ef4444';
            return (
              <Paper key={child.student_id} sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                {/* Child Header */}
                <Box sx={{ p: 3, background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)', borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8456f1, #a88bff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 900, fontSize: '1.1rem'
                      }}>
                        {child.student_name?.charAt(0)?.toUpperCase()}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{child.student_name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Student ID: #{child.student_id}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5, width: '100%' }}>
                      <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Present</Typography>
                        <Typography sx={{ fontWeight: 900, color: '#10b981', fontSize: '1.1rem' }}>{child.present_days || 0}</Typography>
                      </Box>
                      <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Absent</Typography>
                        <Typography sx={{ fontWeight: 900, color: '#ef4444', fontSize: '1.1rem' }}>{child.absent_days || 0}</Typography>
                      </Box>
                      <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total</Typography>
                        <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>{child.total_days || 0}</Typography>
                      </Box>
                      <Box sx={{ px: 2, py: 1.5, bgcolor: `${attendanceColor}10`, borderRadius: '10px', border: `1px solid ${attendanceColor}30`, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Rate</Typography>
                        <Typography sx={{ fontWeight: 900, color: attendanceColor, fontSize: '1.1rem' }}>{child.attendance_percentage || 0}%</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={child.attendance_percentage || 0}
                      sx={{
                        height: 6, borderRadius: 10,
                        bgcolor: `${attendanceColor}15`,
                        '& .MuiLinearProgress-bar': { borderRadius: 10, bgcolor: attendanceColor }
                      }}
                    />
                  </Box>
                </Box>

                {/* Attendance History Grid */}
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Daily History
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)', lg: 'repeat(7, 1fr)' }, gap: 1 }}>
                    {(child.attendance_history || []).map((record, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1, py: 1,
                          bgcolor: getStatusBg(record.status),
                          borderRadius: '10px',
                          border: `1px solid ${getStatusColor(record.status)}20`,
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'scale(1.05)', boxShadow: `0 4px 12px ${getStatusColor(record.status)}20` }
                        }}
                      >
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                          {new Date(record.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: getStatusColor(record.status) }}>
                          {record.status}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
          <CalendarCheck size={48} color="#cbd5e1" />
          <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 700 }}>No attendance records found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting the filters or contact administration.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ParentAttendance;
