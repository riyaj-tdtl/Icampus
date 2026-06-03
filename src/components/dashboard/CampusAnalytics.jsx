import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { MoreHorizontal, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', engagement: 40 },
  { name: 'Tue', engagement: 65 },
  { name: 'Wed', engagement: 55 },
  { name: 'Thu', engagement: 85 },
  { name: 'Fri', engagement: 70 },
  { name: 'Sat', engagement: 95 },
  { name: 'Sun', engagement: 110 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', p: 1.5, borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
          {payload[0].payload.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#8456f1' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Engagement: {payload[0].value}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

const CampusAnalytics = () => {
  return (
    <Card 
      component={motion.div}
      whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: '20px' }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Activity size={20} color="#8456f1" />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              Campus Activity
            </Typography>
          </Box>
          <IconButton size="small" sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
            <MoreHorizontal size={20} color="#94a3b8" />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, fontWeight: 500 }}>
          Real-time portal engagement
        </Typography>

        <Box sx={{ flexGrow: 1, height: 160, ml: -2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8456f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8456f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="engagement" stroke="#8456f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampusAnalytics;
