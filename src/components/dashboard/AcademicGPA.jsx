import { Card, CardContent, Typography, Box } from '@mui/material';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

const gpaData = [
  { term: 'Fall 22', gpa: 3.4 },
  { term: 'Spr 23', gpa: 3.5 },
  { term: 'Fall 23', gpa: 3.7 },
  { term: 'Spr 24', gpa: 3.82 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', p: 1.5, borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
          {data.term}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#8456f1' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            GPA: {data.gpa.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

const AcademicGPA = ({ averageScore }) => {
  const displayScore = averageScore !== undefined ? averageScore : 3.82;
  const isPercentage = displayScore > 4.0;

  return (
    <Card 
      component={motion.div}
      whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: '20px' }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Activity size={20} color="#8456f1" />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              Academic Performance
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
              {isPercentage ? `${displayScore}%` : displayScore}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.6rem', letterSpacing: 0.5 }}>
              {isPercentage ? 'AVG TEST SCORE' : 'CURRENT GPA'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, height: 160, mb: 3, ml: -2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gpaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} dy={10} />
              <YAxis hide domain={[0, 4.0]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="gpa" radius={[6, 6, 6, 6]} barSize={32} animationDuration={1500}>
                {gpaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === gpaData.length - 1 ? '#8456f1' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box 
            component={motion.div} 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(132, 86, 241, 0.05)' }}
            sx={{ flex: 1, bgcolor: 'background.default', borderRadius: '12px', p: 2, textAlign: 'center', transition: 'background-color 0.2s' }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Current Status
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5 }}>
              Active
            </Typography>
          </Box>
          <Box 
            component={motion.div} 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
            sx={{ flex: 1, bgcolor: 'background.default', borderRadius: '12px', p: 2, textAlign: 'center', transition: 'background-color 0.2s' }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Academic standing
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5 }}>
              Good
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AcademicGPA;
