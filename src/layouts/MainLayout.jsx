import { useState, useEffect } from 'react';
import { Box, Fab, Tooltip, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIChatModal from '../components/AIChatModal';
import { Bot, Menu } from 'lucide-react';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} onOpenAi={() => setIsAiModalOpen(true)} />
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          width: isMobile ? '100%' : (sidebarOpen ? 'calc(100% - 292px)' : 'calc(100% - 116px)'), 
          transition: 'width 0.3s ease' 
        }}
      >
        <Navbar onOpenAi={() => setIsAiModalOpen(true)} onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 3 }, 
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'background.default'
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <AIChatModal open={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      
      <Tooltip title="iCampus AI Tutor" placement="left" arrow>
        <Fab 
          color="primary" 
          onClick={() => setIsAiModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            boxShadow: '0 10px 40px rgba(132, 86, 241, 0.4)',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.1) translateY(-5px)',
              boxShadow: '0 15px 50px rgba(132, 86, 241, 0.6)',
            }
          }}
        >
          <Bot size={28} />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default MainLayout;
