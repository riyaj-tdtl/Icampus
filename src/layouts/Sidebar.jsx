import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  BookOpen, 
  ClipboardList, 
  MessageSquare, 
  FileText, 
  Clock, 
  Settings, 
  Zap,
  Shield,
  Menu,
  X,
  Building2,
  Pencil
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const allNavItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Students', icon: <Users size={20} />, path: '/students', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'] },
  { text: 'Registration Approvals', icon: <ClipboardList size={20} />, path: '/students/approvals', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'] },
  { text: 'Teachers', icon: <GraduationCap size={20} />, path: '/teachers', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { text: 'Homework', icon: <Pencil size={20} />, path: '/homework', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Attendance', icon: <CalendarCheck size={20} />, path: '/attendance', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Academics', icon: <BookOpen size={20} />, path: '/academics', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'] },
  { text: 'Examinations', icon: <ClipboardList size={20} />, path: '/examinations', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Programs', icon: <CalendarCheck size={20} />, path: '/programs', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Hostel', icon: <Building2 size={20} />, path: '/hostel', roles: ['SUPER_ADMIN', 'ADMIN', 'STUDENT'] },
  { text: 'Announcemenets', icon: <MessageSquare size={20} />, path: '/communication', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Assessments', icon: <FileText size={20} />, path: '/assessments', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'] },
  { text: 'Timetable', icon: <Clock size={20} />, path: '/timetable', roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'] },
  { text: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['SUPER_ADMIN', 'ADMIN'] },
];

const SidebarContent = ({ open, setOpen, isMobile, navigate, location, onOpenAi }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { role: 'STUDENT', first_name: 'Student', last_name: 'User' };
  const role = user?.role || 'STUDENT';
  const portalPrefix = (role === 'SUPER_ADMIN' || role === 'ADMIN') ? '/admin-portal' : (role === 'TEACHER' ? '/teacher-portal' : '/student-portal');

  const navItems = allNavItems
    .filter(item => item.roles.includes(role))
    .map(item => ({ ...item, path: `${portalPrefix}${item.path}` }));

  return (
    <Box
      sx={{
        width: isMobile ? 280 : (open ? 260 : 84),
        backgroundColor: '#8456f1',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100%' : 'calc(100vh - 32px)',
        margin: isMobile ? 0 : '16px',
        borderRadius: isMobile ? 0 : '24px',
        boxShadow: isMobile ? 'none' : '0 10px 40px rgba(132, 86, 241, 0.3)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: (open || isMobile) ? 3 : 2, pt: 3, display: 'flex', alignItems: 'center', justifyContent: (open || isMobile) ? 'space-between' : 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, opacity: (open || isMobile) ? 1 : 0, width: (open || isMobile) ? 'auto' : 0, transition: 'opacity 0.2s', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              bgcolor: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#8456f1',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            <img src={`${import.meta.env.BASE_URL}image copy.png`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1, letterSpacing: '0.5px' }}>
              iCAMPUS
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => setOpen(!open)} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          {isMobile ? <X size={20} /> : <Menu size={20} />}
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1, px: (open || isMobile) ? 2 : 1, overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  bgcolor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: active ? 'white' : 'inherit',
                  justifyContent: (open || isMobile) ? 'flex-start' : 'center',
                  alignItems: 'center',
                  px: (open || isMobile) ? 2 : 0,
                  py: 1.5,
                  minHeight: 48,
                  '&:hover': {
                    bgcolor: active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: (open || isMobile) ? 2 : 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: active ? 800 : 600 }}>
                      {item.text}
                    </Typography>
                  } 
                  sx={{ 
                    opacity: (open || isMobile) ? 1 : 0, 
                    display: (open || isMobile) ? 'block' : 'none',
                    transition: 'opacity 0.2s',
                    whiteSpace: 'nowrap',
                    m: 0
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: (open || isMobile) ? 2 : 1, display: 'flex', flexDirection: 'column', gap: 2, pb: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            if (onOpenAi) onOpenAi();
            if (isMobile) setOpen(false);
          }}
          sx={{
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            justifyContent: (open || isMobile) ? 'flex-start' : 'center',
            px: (open || isMobile) ? 2 : 0,
            py: 1.5,
            minWidth: 0,
            borderRadius: '12px',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
              borderColor: 'white',
            }
          }}
        >
          <Zap size={18} />
          {(open || isMobile) && <span style={{ marginLeft: '12px', fontWeight: 600, fontSize: '0.9rem' }}>AI Assistant</span>}
        </Button>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: (open || isMobile) ? 'flex-start' : 'center', 
            gap: (open || isMobile) ? 1.5 : 0, 
            px: (open || isMobile) ? 1 : 0, 
            py: 1, 
            cursor: 'pointer', 
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: 'white' } 
          }}
        >
          <Shield size={18} />
          {(open || isMobile) && (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap' }}>{user.first_name} {user.last_name}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{user.role.replace('_', ' ')} Portal</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Sidebar = ({ open, setOpen, onOpenAi }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            border: 'none'
          }
        }}
      >
        <SidebarContent 
          open={open} 
          setOpen={setOpen} 
          isMobile={true} 
          navigate={navigate} 
          location={location} 
          onOpenAi={onOpenAi} 
        />
      </Drawer>
    );
  }

  return (
    <SidebarContent 
      open={open} 
      setOpen={setOpen} 
      isMobile={false} 
      navigate={navigate} 
      location={location} 
      onOpenAi={onOpenAi} 
    />
  );
};

export default Sidebar;
