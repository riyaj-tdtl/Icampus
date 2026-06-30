import { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Link, InputAdornment, IconButton, Paper, Container, CircularProgress } from '@mui/material';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { showError, showSuccess } from '../utils/swalUtils';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        showError('Required Fields', 'Please enter both email and password.');
        return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      if (response && response.tokens && response.tokens.access) {
        const userData = { ...response.user, role: response.role };
        
        // Use AuthContext to store tokens and user state
        login(userData, response.tokens.access, response.tokens.refresh);
        
        // Determine Portal
        let portalPath = '/student-portal/dashboard';
        if (userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN') {
          portalPath = '/admin-portal/dashboard';
        } else if (userData.role === 'TEACHER') {
          portalPath = '/teacher-portal/dashboard';
        } else if (userData.role === 'PARENT') {
          portalPath = '/parent-portal/dashboard';
        }
        
        showSuccess('Login Successful', `Welcome back, ${userData.name || 'User'}!`);
        navigate(portalPath);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Invalid credentials. Please try again.';
      showError('Authentication Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Left Side: Visual Branding */}
      <Box 
        sx={{ 
          flex: 1.2, 
          position: 'relative',
          display: { xs: 'none', lg: 'block' },
          backgroundImage: `url("${import.meta.env.BASE_URL}image copy 2.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(132, 86, 241, 0.4), rgba(15, 23, 42, 0.8))',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, p: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Top Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 'auto' }}>
            <Box sx={{ 
              width: 48, height: 48, 
              bgcolor: 'rgba(255,255,255,0.2)', 
              borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              overflow: 'hidden'
            }}>
              <img src={`${import.meta.env.BASE_URL}image copy.png`} alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1, fontSize: '1.4rem', letterSpacing: '0.5px' }}>iCampus</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Smart ERP Solutions</Typography>
            </Box>
          </Box>

          {/* Hero Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h1" sx={{ color: '#fff', fontWeight: 900, fontSize: '4.5rem', lineHeight: 1, mb: 1, letterSpacing: '-3px' }}>
              Welcome back to
            </Typography>
            <Typography variant="h1" sx={{ color: '#fff', fontWeight: 900, fontSize: '5rem', lineHeight: 1, mb: 3, letterSpacing: '-3px', opacity: 0.9 }}>
              iCampus <span style={{ color: '#8456f1' }}>.</span>
            </Typography>
            <Box sx={{ width: 80, height: 6, bgcolor: '#8456f1', mb: 4, borderRadius: 10 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, maxWidth: 500, lineHeight: 1.6, fontSize: '1.25rem', mb: 6 }}>
              The all-in-one autonomous campus management system for students, faculty, and administration.
            </Typography>

            <Paper sx={{ 
              p: 3, 
              bgcolor: 'rgba(255,255,255,0.08)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.15)',
              maxWidth: 420,
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}>
               <Box sx={{ 
                width: 56, height: 56, 
                bgcolor: '#8456f1', 
                borderRadius: '16px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(132, 86, 241, 0.5)'
              }}>
                <Lock color="#fff" size={24} />
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', mb: 0.2 }}>Secure Authentication</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.4 }}>Multi-factor protected enterprise portal access.</Typography>
              </Box>
            </Paper>
          </Box>

          <Typography sx={{ mt: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>
            © 2026 iCampus ERP. All Rights Reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Side: Centered Login Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#fff',
        position: 'relative',
        overflowY: 'auto'
      }}>
        <Container sx={{ width: '100%', maxWidth: 420, py: 8, my: 'auto' }}>
          <Box sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '30px',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px rgba(132, 86, 241, 0.08), inset 0 0 0 1px rgba(255,255,255,0.5)',
          }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              {/* Professional Logo Display */}
              <Box sx={{ 
                width: 100, height: 100, 
                bgcolor: '#fff', 
                borderRadius: '24px', 
                mx: 'auto', mb: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                border: '1px solid #f8fafc',
                overflow: 'hidden'
              }}>
                <img src={`${import.meta.env.BASE_URL}image copy.png`} alt="Crest" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1, letterSpacing: '-1.5px', fontSize: '2.2rem' }}>
                Login to Account
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>
                Welcome back! Please enter your credentials.
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', mb: 1.5, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Email or Username
                </Typography>
                <TextField 
                  fullWidth 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '16px',
                      height: '48px',
                      bgcolor: '#fff',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      '& fieldset': { border: '1px solid #e2e8f0' },
                      '&:hover fieldset': { borderColor: '#8456f1' },
                      '&.Mui-focused fieldset': { border: '2px solid #8456f1' }
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', mb: 1.5, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Portal Password
                </Typography>
                <TextField 
                  fullWidth 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '16px',
                      height: '48px',
                      bgcolor: '#fff',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      '& fieldset': { border: '1px solid #e2e8f0' },
                      '&:hover fieldset': { borderColor: '#8456f1' },
                      '&.Mui-focused fieldset': { border: '2px solid #8456f1' }
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <FormControlLabel 
                  control={<Checkbox size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#8456f1' } }} />} 
                  label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Keep me logged in</Typography>} 
                />
                <Link href="#" sx={{ color: '#8456f1', textDecoration: 'none', fontWeight: 800, fontSize: '0.85rem' }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button 
                fullWidth 
                type="submit"
                variant="contained" 
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  borderRadius: '16px', 
                  fontWeight: 900, 
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  bgcolor: '#8456f1',
                  boxShadow: '0 10px 25px rgba(132, 86, 241, 0.4)',
                  '&:hover': { bgcolor: '#7344e3', transform: 'translateY(-2px)', boxShadow: '0 15px 35px rgba(132, 86, 241, 0.5)' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  gap: 1.5
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In to Portal'}
              </Button>
            </form>

            <Typography sx={{ mt: 4, textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
              Don't have an account? <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} sx={{ color: '#8456f1', fontWeight: 900, textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>New Student Register here</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
    
  );
};

export default Login;

