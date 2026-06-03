import { Box, Typography, Paper, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Button, Chip } from '@mui/material';
import { ArrowLeft, Bell, Lock, Palette, ShieldCheck, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../utils/swalUtils';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'ADMIN';
  const isTeacher = role === 'TEACHER';

  const settingRows = [
    {
      icon: <Bell size={18} />,
      title: 'Portal Notifications',
      description: 'Receive campus alerts, attendance updates, and announcements.',
      enabled: true
    },
    {
      icon: <Lock size={18} />,
      title: 'Secure Session',
      description: 'Keep login sessions protected with token-based access.',
      enabled: true
    },
    {
      icon: <Palette size={18} />,
      title: 'Compact Dashboard',
      description: 'Use a denser layout for cards, tables, and quick actions.',
      enabled: false
    }
  ];

  return (
    <Box sx={{ pb: 4, maxWidth: 900 }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>
          Back
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Account Settings
        </Typography>
        <Typography color="text.secondary">
          Static preferences for your {isTeacher ? 'faculty' : 'admin'} portal.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(132, 86, 241, 0.1)', color: '#8456f1' }}>
            {isTeacher ? <UserCog size={22} /> : <ShieldCheck size={22} />}
          </Box>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography sx={{ fontWeight: 800 }}>Portal Access</Typography>
            <Typography variant="body2" color="text.secondary">
              {isTeacher ? 'Faculty tools, student attendance, homework, and academic modules.' : 'Administrative tools, campus records, approvals, and system controls.'}
            </Typography>
          </Box>
          <Chip label={role.replace('_', ' ')} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <List disablePadding>
          {settingRows.map((item, index) => (
            <Box key={item.title}>
              <ListItem sx={{ py: 2.5, px: 3 }}>
                <Box sx={{ mr: 2, color: '#8456f1', display: 'flex' }}>{item.icon}</Box>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  primaryTypographyProps={{ fontWeight: 800 }}
                  secondaryTypographyProps={{ sx: { mt: 0.4 } }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    defaultChecked={item.enabled}
                    color="primary"
                    onChange={(event) => showSuccess('Preference Updated', `${item.title} ${event.target.checked ? 'enabled' : 'disabled'}.`)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {index < settingRows.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Settings;
