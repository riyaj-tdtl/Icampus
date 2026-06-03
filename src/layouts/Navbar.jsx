import { useState, useEffect } from 'react';
import { Box, InputBase, Button, IconButton, Avatar, Typography, Divider, Menu, MenuItem, Badge, Chip, ListItemIcon, Tooltip } from '@mui/material';
import { Search, Bell, MessageSquare, User, Settings, LogOut, Activity, Menu as MenuIcon, Plus } from 'lucide-react';
import { showComplexForm, showSuccess, confirmDelete } from '../utils/swalUtils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notification.service';

const Navbar = ({ onOpenAi, onMenuClick, isMobile }) => {
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const openNotif = Boolean(notifAnchor);
  const openProfile = Boolean(profileAnchor);

  // Read names directly from the logged in user data in localStorage
  const displayFirstName = user?.first_name || '';
  const displayLastName = user?.last_name || '';
  const role = user?.role || 'GUEST';
  const portalPrefix = role === 'TEACHER' ? '/teacher-portal' : (role === 'STUDENT' ? '/student-portal' : '/admin-portal');
  const accountStatusLabel = role === 'STUDENT' ? 'Student Verified' : (role === 'TEACHER' ? 'Faculty Verified' : 'Admin Verified');

  const goToAccountPage = (path) => {
    setProfileAnchor(null);
    navigate(`${portalPrefix}/${path}`);
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data.results || []);
      const countData = await notificationService.getUnreadCount();
      setUnreadCount(countData.unread_notifications || 0);
    } catch {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchNotifications);
  }, []);

  const handleLogout = () => {
    setProfileAnchor(null);
    confirmDelete('Logout?', 'Are you sure you want to end your current session?').then(res => {
      if (res.isConfirmed) {
        showSuccess('Logged Out!', 'Redirecting to login...');
        setTimeout(() => logout(), 1000);
      }
    });
  };

  const handleQuickAdd = () => {
    showComplexForm('Quick Action', [
      { id: 'type', label: 'Action Type', placeholder: 'e.g. New Event, Quick Note' },
      { id: 'desc', label: 'Description', placeholder: 'Write a brief summary...' }
    ]).then(res => {
      if (res.isConfirmed && res.value) {
        showSuccess('Task Logged!', 'The quick action has been saved to your workspace.');
      }
    })
  };

  return (
    <Box
      component="header"
      sx={{
        height: 72,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 4 },
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: isMobile ? 'auto' : 480, gap: 1 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} sx={{ color: 'text.primary' }}>
            <MenuIcon size={24} />
          </IconButton>
        )}
        
        <Box
          sx={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            backgroundColor: 'background.default',
            borderRadius: '20px',
            px: 2,
            py: 1,
            width: '100%',
          }}
        >
          <Search size={18} color="#94a3b8" />
          <InputBase
            placeholder="Search portal..."
            sx={{ ml: 1.5, flex: 1, fontSize: '0.875rem' }}
          />
        </Box>

        {isMobile && (
           <IconButton sx={{ bgcolor: 'background.default', borderRadius: '12px' }}>
              <Search size={20} color="#64748b" />
           </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
        {isMobile ? (
          <Tooltip title="Quick Add">
            <IconButton 
              color="primary" 
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
              onClick={handleQuickAdd}
            >
              <Plus size={20} />
            </IconButton>
          </Tooltip>
        ) : (
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Plus size={18} />}
            sx={{ 
              borderRadius: '20px', 
              px: 3, 
              py: 0.75,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none'
            }}
            onClick={handleQuickAdd}
          >
            Quick Add
          </Button>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={unreadCount} color="error" overlap="circular">
              <Bell size={20} color="#64748b" />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notifAnchor}
            open={openNotif}
            onClose={() => setNotifAnchor(null)}
            PaperProps={{
              sx: {
                width: 320,
                mt: 1.5,
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                p: 1
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>Notifications</Typography>
              {unreadCount > 0 && <Chip label={`${unreadCount} New`} size="small" color="primary" sx={{ fontSize: '0.7rem', height: 20 }} />}
            </Box>
            <Divider sx={{ my: 1 }} />
            {notifications.length > 0 ? notifications.slice(0, 5).map(n => (
              <MenuItem key={n.id} onClick={() => setNotifAnchor(null)} sx={{ borderRadius: '12px', py: 1.5, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, color: !n.is_read ? 'text.primary' : 'text.secondary' }}>{n.title}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{n.created_at ? new Date(n.created_at).toLocaleDateString() : '-'}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.4 }}>{n.message}</Typography>
                <Box sx={{ display: 'flex', gap: 0.75, mt: 1, flexWrap: 'wrap' }}>
                  <Chip label={n.target_role || 'ALL'} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                  {n.target_class && <Chip label={`Class ${n.target_class}`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />}
                </Box>
              </MenuItem>
            )) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Button fullWidth sx={{ textTransform: 'none', fontWeight: 600, py: 1 }} onClick={() => { setNotifAnchor(null); navigate(`/${window.location.pathname.split('/')[1]}/communication`); }}>View All Alerts</Button>
          </Menu>

          <IconButton size="small" onClick={onOpenAi}>
            <MessageSquare size={20} color="#64748b" />
          </IconButton>
        </Box>

        {!isMobile && <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1, height: 32, alignSelf: 'center' }} />}

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            cursor: 'pointer',
            p: 0.5,
            borderRadius: '12px',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: 'rgba(132, 86, 241, 0.05)' }
          }}
          onClick={(e) => setProfileAnchor(e.currentTarget)}
        >
          <Box sx={{ textAlign: 'right', display: { xs: 'none', lg: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
              {displayFirstName} {displayLastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', letterSpacing: 0.5 }}>
              {role.replace('_', ' ')}
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              width: { xs: 36, md: 44 }, 
              height: { xs: 36, md: 44 },
              border: '2px solid transparent',
              transition: 'all 0.2s',
              '.MuiBox-root:hover &': { borderColor: 'primary.main' }
            }}
          />
        </Box>

        <Menu
          anchorEl={profileAnchor}
          open={openProfile}
          onClose={() => setProfileAnchor(null)}
          PaperProps={{
            sx: {
              width: 220,
              mt: 1.5,
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              p: 1
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Account Status</Typography>
            <Chip label={accountStatusLabel} size="small" color="success" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, mt: 0.5 }} />
          </Box>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={() => goToAccountPage('profile')} sx={{ borderRadius: '10px', py: 1 }}>
            <ListItemIcon><User size={18} /></ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>My Profile</Typography>
          </MenuItem>
          {role !== 'STUDENT' && (
            <MenuItem onClick={() => goToAccountPage('settings')} sx={{ borderRadius: '10px', py: 1 }}>
              <ListItemIcon><Settings size={18} /></ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography>
            </MenuItem>
          )}
          <MenuItem onClick={() => goToAccountPage('activity-log')} sx={{ borderRadius: '10px', py: 1 }}>
            <ListItemIcon><Activity size={18} /></ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Activity Log</Typography>
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ borderRadius: '10px', py: 1, color: 'error.main' }}>
            <ListItemIcon><LogOut size={18} color="#ef4444" /></ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Logout Session</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
