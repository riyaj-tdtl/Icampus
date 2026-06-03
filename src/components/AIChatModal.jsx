import { useState, useEffect, useRef } from 'react';
import { Drawer, Box, Typography, IconButton, InputBase, Chip, Avatar } from '@mui/material';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotService } from '../services/chatbot.service';

const AIChatModal = ({ open, onClose }) => {
  const getInitialMessage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { role: 'ai', content: `Hello ${user.first_name || 'there'}! I'm your iCampus AI Tutor. How can I help you today?` };
  };

  const [messages, setMessages] = useState([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    
    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotService.ask(userMsg);
      const botMessage = res.message || res.reply || res.response || 'I am sorry, I am having trouble connecting right now.';
      const supportInfo = res.contact_support ? `\n\nNeed help? Contact ${res.contact_support.department} at ${res.contact_support.phone} or ${res.contact_support.email}.` : '';
      const aiReply = `${botMessage}${supportInfo}`;
      setMessages(prev => [...prev, { role: 'ai', content: aiReply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'An error occurred. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    const handleAuthLogout = () => {
      setMessages([getInitialMessage()]);
      setInput('');
      setLoading(false);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ 
        '& .MuiDrawer-paper': { 
          width: { xs: '100%', sm: 420 }, 
          borderTopLeftRadius: 32, 
          borderBottomLeftRadius: 32, 
          overflow: 'hidden',
          bgcolor: '#8456f1',
          background: 'linear-gradient(180deg, #8456f1 0%, #6d28d9 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '-16px 0 80px rgba(39, 37, 58, 0.55)',
          borderLeft: '1px solid rgba(255,255,255,0.12)'
        } 
      }}
    >
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        color: 'white',
        backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 35%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 30%)',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: 20, right: -60, width: 160, height: 160, bgcolor: 'rgba(132, 86, 241, 0.14)', borderRadius: '50%', filter: 'blur(28px)' }} />
        <Box sx={{ position: 'absolute', bottom: 80, left: -50, width: 120, height: 120, bgcolor: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              component={motion.div}
              animate={{ boxShadow: ['0 0 0px #8456f1', '0 0 22px rgba(132, 86, 241, 0.45)', '0 0 0px #8456f1'] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              sx={{ width: 48, height: 48, borderRadius: '16px', bgcolor: '#8456f1', background: 'linear-gradient(135deg, #8456f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Bot size={24} color="white" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                iCampus AI Tutor <Sparkles size={14} color="#f59e0b" />
              </Typography>
              <Typography variant="body2" sx={{ color: '#c7d2fe', fontWeight: 500, fontSize: '0.78rem', mt: 0.5 }}>
                Your premium study partner for smarter learning.
              </Typography>
              <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 0.5, mt: 0.5, display: 'block' }}>
                ACTIVE INTELLIGENCE
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#cbd5e1', bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.12)' } }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end', 
                  maxWidth: '85%', 
                  display: 'flex', 
                  gap: 1.5, 
                  flexDirection: msg.role === 'ai' ? 'row' : 'row-reverse' 
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: msg.role === 'ai' ? '#8456f1' : '#475569', mt: 1 }}>
                  {msg.role === 'ai' ? <Bot size={18} /> : (user.first_name ? user.first_name[0] : 'U')}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, ml: msg.role === 'ai' ? 1 : 0, mr: msg.role === 'user' ? 1 : 0, mb: 0.5, display: 'block', textAlign: msg.role === 'ai' ? 'left' : 'right' }}>
                    {msg.role === 'ai' ? 'AI Tutor' : 'You'}
                  </Typography>
                  <Typography 
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{ 
                      bgcolor: msg.role === 'ai' ? 'rgba(255,255,255,0.12)' : '#8456f1', 
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #8456f1 0%, #4f46e5 100%)' : undefined,
                      color: msg.role === 'ai' ? '#e2e8f0' : 'white', 
                      p: 2.25, 
                      borderRadius: '22px', 
                      borderTopLeftRadius: msg.role === 'ai' ? '6px' : '22px',
                      borderTopRightRadius: msg.role === 'user' ? '6px' : '22px', 
                      fontSize: '0.96rem', 
                      lineHeight: 1.65, 
                      border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.12)' : 'none', 
                      backdropFilter: msg.role === 'ai' ? 'blur(14px)' : 'none',
                      boxShadow: msg.role === 'user' ? '0 18px 40px rgba(132, 86, 241, 0.16)' : '0 10px 30px rgba(0,0,0,0.08)',
                      textShadow: msg.role === 'user' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </AnimatePresence>

          {loading && (
            <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%', display: 'flex', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#8456f1', mt: 1 }}><Bot size={18} /></Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, ml: 1, mb: 0.5, display: 'block' }}>AI Tutor • Typing...</Typography>
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', p: 2, borderRadius: '20px', borderTopLeftRadius: '4px', display: 'flex', gap: 1 }}
                >
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8456f1' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8456f1' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8456f1' }} />
                </Box>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 3, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {['Summarize Unit 4', 'Exam Tips', 'Generate Quiz'].map((label, idx) => (
              <Chip 
                key={label}
                component={motion.div} whileHover={{ scale: 1.05 }}
                label={label} size="small" 
                onClick={() => handleSend(label)}
                sx={{ bgcolor: 'rgba(132, 86, 241, 0.13)', color: '#e0e7ff', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(132, 86, 241, 0.25)', '&:hover': { bgcolor: 'rgba(132, 86, 241, 0.24)' }, cursor: 'pointer', py: 0.75, px: 1.5 }} 
              />
            ))}
          </Box>
          <Box 
            sx={{ 
              display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.04)', 
              borderRadius: '24px', p: '10px 16px', border: '1px solid rgba(255,255,255,0.12)',
              transition: 'all 0.25s', '&:focus-within': { borderColor: '#8456f1', bgcolor: 'rgba(255,255,255,0.08)', boxShadow: '0 0 0 4px rgba(132, 86, 241, 0.08)' }
            }}
          >
            <InputBase 
              placeholder="Ask anything about your courses..." 
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              inputProps={{ style: { color: 'white', fontSize: '0.95rem' } }}
              sx={{ flex: 1 }}
            />
            <IconButton 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              sx={{ bgcolor: '#8456f1', color: 'white', ml: 1, width: 40, height: 40, '&:hover': { bgcolor: '#6d28d9', transform: 'scale(1.05)' }, transition: 'all 0.2s', '&.Mui-disabled': { bgcolor: 'rgba(132, 86, 241, 0.45)', color: 'rgba(255,255,255,0.65)' } }}
            >
              <Send size={18} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AIChatModal;
