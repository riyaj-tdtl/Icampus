import { Card, CardContent, Typography, Box } from '@mui/material';
import { CalendarCheck } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'M', present: 100, status: 'Present' },
  { name: 'T', present: 100, status: 'Present' },
  { name: 'W', present: 100, status: 'Present' },
  { name: 'T', present: 50, status: 'Absent' },
  { name: 'F', present: 100, status: 'Present' },
  { name: 'S', present: 100, status: 'On Leave' },
  { name: 'S', present: 100, status: 'On Leave' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let color = '#8456f1';
    if (data.status === 'Absent') color = '#ef4444';
    if (data.status === 'On Leave') color = '#cbd5e1';

    return (
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', p: 1.5, borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
          {data.name} (This Week)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {data.status}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

const Attendance = ({ percentage }) => {
  const displayPercentage = percentage !== undefined ? percentage : 92;

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
            <CalendarCheck size={20} color="#6366f1" />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              Attendance
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#4338ca', lineHeight: 1 }}>
              {displayPercentage}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.6rem', letterSpacing: 0.5 }}>
              AVG ATTENDANCE
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 120, mb: 2, ml: -2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} dy={10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="present" radius={[4, 4, 4, 4]} barSize={24} animationDuration={1500}>
                {data.map((entry, index) => {
                  let color = '#8456f1';
                  if (entry.status === 'Absent') color = '#ef4444';
                  if (entry.status === 'On Leave') color = '#e2e8f0';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: '8px', '&:hover': { bgcolor: 'rgba(132, 86, 241, 0.05)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#8456f1' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Present Rate</Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{displayPercentage}%</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: '8px', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.05)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Absent Rate</Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{Math.max(0, 100 - displayPercentage)}%</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Attendance;
