import { Card, CardContent, Typography, Box, InputBase, IconButton, Chip } from '@mui/material';
import { Bot, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const AITutor = () => {
  return (
    <Card 
      component={motion.div}
      whileHover={{ y: -5, boxShadow: '0 20px 40px 0 rgba(15, 23, 42, 0.3)' }}
      transition={{ duration: 0.3 }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '20px',
        bgcolor: '#0f172a',
        color: 'white',
        backgroundImage: 'radial-gradient(circle at top right, rgba(132, 86, 241, 0.15), transparent 60%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#8456f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              iCampus AI Tutor
            </Typography>
            <Typography variant="caption" sx={{ color: '#8456f1', fontWeight: 800, fontSize: '0.65rem', letterSpacing: 0.5 }}>
              ACTIVE INTELLIGENCE
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 1 }}>
          <Typography 
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.95rem' }}
          >
            "Hello Aryan! I've analyzed your Quantum Mechanics notes. Ready to review the Heisenberg uncertainty principle for tomorrow?"
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box 
            component={motion.div}
            whileFocus={{ scale: 1.02 }}
            sx={{ 
              display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', 
              borderRadius: '16px', p: '4px 8px', mb: 2, border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s', '&:focus-within': { borderColor: '#8456f1', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
          >
            <InputBase 
              placeholder="Ask anything about your courses..." 
              sx={{ ml: 1, flex: 1, color: 'white', fontSize: '0.9rem' }}
            />
            <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: 'white', bgcolor: 'rgba(132,86,241,0.2)' } }}>
              <Send size={16} />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              component={motion.div} whileHover={{ scale: 1.05 }}
              label="Summarize Unit 4" size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, cursor: 'pointer' }} 
            />
            <Chip 
              component={motion.div} whileHover={{ scale: 1.05 }}
              label="Exam Tips" size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, cursor: 'pointer' }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AITutor;
