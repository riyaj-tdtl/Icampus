import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, TextField, MenuItem, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BookOpen, Filter, Clock, Calendar } from 'lucide-react';
import { parentService } from '../../services/parent.service';

const ParentHomework = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ student_name: '', date: '' });

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.student_name) params.student_name = filters.student_name;
      if (filters.date) params.date = filters.date;
      const result = await parentService.getHomework(params);
      setData(result);
    } catch (err) {
      console.error('Failed to fetch homework:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHomework(); }, []);

  const handleFilter = () => { fetchHomework(); };

  const children = data?.data || [];
  const childNames = [...new Set(children.map(c => c.student_name))];

  const getDueStatus = (dueDate) => {
    if (!dueDate) return { label: 'No Date', color: '#94a3b8', bg: '#f8fafc' };
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Overdue', color: '#ef4444', bg: '#fef2f2' };
    if (diff === 0) return { label: 'Due Today', color: '#f59e0b', bg: '#fffbeb' };
    if (diff <= 3) return { label: `${diff}d left`, color: '#f59e0b', bg: '#fffbeb' };
    return { label: `${diff}d left`, color: '#10b981', bg: '#f0fdf4' };
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
          Homework Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay updated with your children's homework and assignments.
        </Typography>
      </Box>

      {/* Summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ p: 2, bgcolor: '#f0ebff', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 160 }}>
          <BookOpen size={22} color="#8456f1" />
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total Assignments</Typography>
            <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.3rem' }}>{data?.homework_count || 0}</Typography>
          </Box>
        </Box>
        <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 160 }}>
          <Calendar size={22} color="#3b82f6" />
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Children</Typography>
            <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.3rem' }}>{data?.count || 0}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Filter size={18} color="#8456f1" />
          <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Filters</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <TextField
            select
            size="small"
            label="Student"
            value={filters.student_name}
            onChange={(e) => setFilters(prev => ({ ...prev, student_name: e.target.value }))}
            sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          >
            <MenuItem value="">All Children</MenuItem>
            {childNames.map(name => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <Chip
            label="Apply"
            onClick={handleFilter}
            sx={{
              bgcolor: '#8456f1', color: '#fff', fontWeight: 700, cursor: 'pointer',
              height: 38, borderRadius: '10px', px: 1,
              '&:hover': { bgcolor: '#7344e3' }
            }}
          />
        </Box>
      </Paper>

      {/* Children Homework */}
      {children.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {children.map((child) => (
            <Paper key={child.student_id} sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              {/* Child Header */}
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8456f1, #a88bff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: '1.1rem'
                }}>
                  {child.student_name?.charAt(0)?.toUpperCase()}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{child.student_name}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Class {child.class_id}</Typography>
                </Box>
                <Chip 
                  label={`${(child.homework || []).length} Assignment${(child.homework || []).length !== 1 ? 's' : ''}`} 
                  size="small"
                  sx={{ ml: 'auto', bgcolor: '#f0ebff', color: '#8456f1', fontWeight: 700, borderRadius: '8px' }}
                />
              </Box>

              {/* Homework Table */}
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Assigned</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(child.homework || []).length > 0 ? (
                      (child.homework || []).map((hw, idx) => {
                        const dueStatus = getDueStatus(hw.due_date);
                        return (
                          <TableRow key={idx} hover sx={{ transition: 'all 0.2s' }}>
                            <TableCell>
                              <Chip label={hw.subject} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px', borderColor: '#8456f133', color: '#8456f1' }} />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{hw.title}</TableCell>
                            <TableCell sx={{ color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hw.description}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                <Calendar size={14} />
                                <Typography sx={{ fontSize: '0.85rem' }}>{hw.assigned_date}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569' }}>
                                <Clock size={14} />
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{hw.due_date}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={dueStatus.label} 
                                size="small"
                                sx={{ 
                                  bgcolor: dueStatus.bg, 
                                  color: dueStatus.color, 
                                  fontWeight: 700, 
                                  borderRadius: '8px',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No homework assigned.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
          <BookOpen size={48} color="#cbd5e1" />
          <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 700 }}>No homework records found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting the filters.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ParentHomework;
