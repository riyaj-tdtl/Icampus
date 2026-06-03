import { Card, CardContent, Typography, Box, Button, Chip, CircularProgress } from '@mui/material';
import { Calendar, FlaskConical, Sigma, Lightbulb, GraduationCap } from 'lucide-react';
import { showComingSoon } from '../../utils/swalUtils';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { examService as testService } from '../../services/exam.service';

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const UpcomingExaminations = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await testService.getAll();
        const examsArray = Array.isArray(res) ? res : (res.results || []);
        const sorted = examsArray.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
        setExams(sorted.slice(0, 3)); // show top 3 upcoming
      } catch (err) {
        console.error('Failed to load upcoming exams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const getSubjectIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('math') || t.includes('algebra') || t.includes('calculus')) {
      return <Sigma size={16} color="white" />;
    }
    if (t.includes('science') || t.includes('physics') || t.includes('chem') || t.includes('bio')) {
      return <FlaskConical size={16} color="white" />;
    }
    return <GraduationCap size={16} color="white" />;
  };

  const getUrgencyChip = (dateStr) => {
    const examDate = new Date(dateStr);
    const diffTime = examDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return <Chip label="URGENT" size="small" sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 800, fontSize: '0.65rem', height: 20 }} />;
    }
    return <Chip label="STANDARD" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800, fontSize: '0.65rem', height: 20 }} />;
  };

  return (
    <Card 
      component={motion.div}
      whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: '20px' }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={20} color="#f59e0b" />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              Upcoming Examinations
            </Typography>
          </Box>
          <Button size="small" sx={{ fontWeight: 600, color: 'primary.main', '&:hover': { bgcolor: 'rgba(132, 86, 241, 0.1)' } }} onClick={() => showComingSoon('Full Examination Schedule')}>
            View Schedule
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={30} sx={{ color: '#8456f1' }} />
          </Box>
        ) : exams.length > 0 ? (
          <Box 
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            sx={{ position: 'relative', pl: 2 }}
          >
            {exams.map((exam, index) => (
              <Box 
                key={exam.id}
                component={motion.div} 
                variants={itemVariants} 
                sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  mb: index === exams.length - 1 ? 0 : 4, 
                  position: 'relative', 
                  '&:hover .timeline-icon': { transform: 'scale(1.1)' } 
                }}
              >
                {index !== exams.length - 1 && (
                  <Box sx={{ position: 'absolute', left: 15, top: 32, bottom: -32, width: '2px', bgcolor: index === 0 ? '#f59e0b' : '#e2e8f0' }} />
                )}
                <Box 
                  className="timeline-icon"
                  sx={{ 
                    width: 32, height: 32, borderRadius: '50%', bgcolor: index === 0 ? '#f59e0b' : '#8456f1', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                    transition: 'transform 0.2s', boxShadow: index === 0 ? '0 4px 10px rgba(245, 158, 11, 0.3)' : '0 4px 10px rgba(132, 86, 241, 0.3)'
                  }}
                >
                  {getSubjectIcon(exam.subject || exam.exam_name)}
                </Box>
                <Box sx={{ flexGrow: 1, p: 1.5, borderRadius: '12px', '&:hover': { bgcolor: 'rgba(132, 86, 241, 0.04)' }, transition: 'background-color 0.2s', mt: -1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                    {getUrgencyChip(exam.exam_date)}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {exam.exam_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Subject: {exam.subject} | Max Marks: {exam.total_marks}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No upcoming exams found.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingExaminations;
