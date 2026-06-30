import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { FileText, Calendar } from 'lucide-react';
import { parentService } from '../../services/parent.service';

const ParentExams = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(0);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const result = await parentService.getExams();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
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
  const exams = currentChild.exams || [];

  const getExamStatus = (examDate) => {
    if (!examDate) return { label: 'No Date', color: '#94a3b8', bg: '#f8fafc' };
    const today = new Date();
    const exam = new Date(examDate);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Completed', color: '#10b981', bg: '#f0fdf4' };
    if (diff === 0) return { label: 'Today', color: '#ef4444', bg: '#fef2f2' };
    if (diff <= 7) return { label: `In ${diff}d`, color: '#f59e0b', bg: '#fffbeb' };
    return { label: `In ${diff}d`, color: '#3b82f6', bg: '#f0f9ff' };
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Examinations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View scheduled examinations and test dates for your children.
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
              Class {currentChild.class_name} • {exams.length} Exam{exams.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Exams Table */}
      {exams.length > 0 ? (
        <Paper sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Exam Name</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Marks</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => {
                  const status = getExamStatus(exam.exam_date);
                  return (
                    <TableRow key={exam.exam_id} hover sx={{ transition: 'all 0.2s' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ p: 1, bgcolor: '#f0ebff', borderRadius: '8px', color: '#8456f1' }}>
                            <FileText size={18} />
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{exam.exam_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={exam.subject} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px', borderColor: '#8456f133', color: '#8456f1' }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569' }}>
                          <Calendar size={14} />
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {new Date(exam.exam_date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>{exam.total_marks}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#64748b' }}>{exam.description}</TableCell>
                      <TableCell>
                        <Chip 
                          label={status.label}
                          size="small"
                          sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, borderRadius: '8px', fontSize: '0.75rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
          <FileText size={48} color="#cbd5e1" />
          <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 700 }}>No exams scheduled</Typography>
          <Typography variant="body2" color="text.secondary">Check back later for upcoming examinations.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ParentExams;
