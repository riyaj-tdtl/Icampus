import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import { LogIn, FileEdit, CheckCircle, Mail, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityLog = () => {
  const navigate = useNavigate();
  const activities = [
    { id: 1, type: 'login', title: 'Successful Login', time: 'Today, 09:42 AM', desc: 'Logged in from IP 192.168.1.45 (Windows/Chrome)', icon: <LogIn size={18} />, color: '#10b981' },
    { id: 2, type: 'update', title: 'Profile Updated', time: 'Yesterday, 04:15 PM', desc: 'Changed phone number and address details.', icon: <FileEdit size={18} />, color: '#f59e0b' },
    { id: 3, type: 'task', title: 'Task Completed', time: 'Oct 22, 11:30 AM', desc: 'Marked "Review Q3 Reports" as done.', icon: <CheckCircle size={18} />, color: '#8456f1' },
    { id: 4, type: 'email', title: 'Email Sent', time: 'Oct 21, 02:20 PM', desc: 'Sent broadcast to all Grade 10 students.', icon: <Mail size={18} />, color: '#3b82f6' },
    { id: 5, type: 'settings', title: 'Security Settings Changed', time: 'Oct 18, 10:00 AM', desc: 'Enabled Two-Factor Authentication.', icon: <Settings size={18} />, color: '#64748b' },
  ];

  return (
    <Box sx={{ pb: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>
          Back
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Activity Log
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your recent actions and system events.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: '24px', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ position: 'relative' }}>
            {/* Timeline Line */}
            <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 24, width: 2, bgcolor: 'divider', zIndex: 0 }} />
            
            {activities.map((activity, index) => (
              <Box key={activity.id} sx={{ display: 'flex', gap: 3, mb: index === activities.length - 1 ? 0 : 4, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'background.paper', border: '2px solid', borderColor: activity.color, color: activity.color, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  {activity.icon}
                </Avatar>
                <Box sx={{ pt: 1, pb: 2, borderBottom: index === activities.length - 1 ? 'none' : '1px solid', borderColor: 'divider', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{activity.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, bgcolor: 'background.default', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                      {activity.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {activity.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityLog;
