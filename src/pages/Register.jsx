import { useState } from 'react';
import { Box, Typography, TextField, Button, Link, InputAdornment, IconButton, Paper, Container, CircularProgress, MenuItem } from '@mui/material';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/student.service';
import { showError, showSuccess } from '../utils/swalUtils';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    academic_class: '',
    address: '',
    guardian_name: '',
    hostel_status: 'NO'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.academic_class) {
        showError('Required Fields', 'Please fill in all core required fields.');
        return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        academic_class: parseInt(formData.academic_class, 10),
        address: formData.address,
        guardian_name: formData.guardian_name,
        hostel_status: formData.hostel_status
      };
      await studentService.create(payload);
      showSuccess('Registration Successful!', 'Your student account has been created. Please wait for admin approval.');
      navigate('/login');
    } catch (error) {
      console.error('Registration Error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to register. Please check the details and try again.';
      showError('Registration Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = { 
    borderRadius: '16px',
    height: '48px',
    bgcolor: '#fff',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    '& fieldset': { border: '1px solid #e2e8f0' },
    '&:hover fieldset': { borderColor: '#8456f1' },
    '&.Mui-focused fieldset': { border: '2px solid #8456f1' }
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

          <Box sx={{ mb: 8 }}>
            <Typography variant="h1" sx={{ color: '#fff', fontWeight: 900, fontSize: '4.5rem', lineHeight: 1, mb: 1, letterSpacing: '-3px' }}>
              Join the
            </Typography>
            <Typography variant="h1" sx={{ color: '#fff', fontWeight: 900, fontSize: '5rem', lineHeight: 1, mb: 3, letterSpacing: '-3px', opacity: 0.9 }}>
              iCampus <span style={{ color: '#8456f1' }}>Family</span>
            </Typography>
            <Box sx={{ width: 80, height: 6, bgcolor: '#8456f1', mb: 4, borderRadius: 10 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, maxWidth: 500, lineHeight: 1.6, fontSize: '1.25rem', mb: 6 }}>
              Create your account to access your digital campus portal, track attendance, submit homework, and more.
            </Typography>
          </Box>

          <Typography sx={{ mt: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>
            © 2026 iCampus ERP. All Rights Reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Side: Registration Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#fff',
        position: 'relative',
        overflowY: 'auto'
      }}>
        <Container sx={{ width: '100%', maxWidth: 500, py: 6, my: 'auto' }}>
          <Box sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '30px',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px rgba(132, 86, 241, 0.08), inset 0 0 0 1px rgba(255,255,255,0.5)',
          }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                width: 80, height: 80, 
                bgcolor: '#fff', 
                borderRadius: '24px', 
                mx: 'auto', mb: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                border: '1px solid #f8fafc',
                overflow: 'hidden'
              }}>
                <img src={`${import.meta.env.BASE_URL}image copy.png`} alt="Crest" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1, letterSpacing: '-1px', fontSize: '2rem' }}>
                Account Registration
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem', mb: 4 }}>
                Create a student account by selecting your class and filling in the required details.
              </Typography>
            </Box>

            <form onSubmit={handleRegister}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Full Name *</Typography>
                  <TextField 
                    fullWidth 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Navya"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><User size={16} color="#94a3b8" /></InputAdornment>,
                      sx: inputStyles
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Email Address *</Typography>
                  <TextField 
                    fullWidth 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. email@example.com"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Mail size={16} color="#94a3b8" /></InputAdornment>,
                      sx: inputStyles
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Phone Number *</Typography>
                  <TextField 
                    fullWidth 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 8000000001"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Phone size={16} color="#94a3b8" /></InputAdornment>,
                      sx: inputStyles
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Password *</Typography>
                  <TextField 
                    fullWidth 
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock size={16} color="#94a3b8" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: inputStyles
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Class *</Typography>
                  <TextField 
                    fullWidth 
                    select
                    name="academic_class"
                    value={formData.academic_class}
                    onChange={handleChange}
                    placeholder="Select class"
                    InputProps={{
                      sx: inputStyles
                    }}
                  >
                    <MenuItem value="">Select class</MenuItem>
                    {[...Array(12)].map((_, idx) => (
                      <MenuItem key={idx + 1} value={(idx + 1).toString()}>
                        {idx + 1}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Hostel Required?</Typography>
                  <TextField 
                    fullWidth 
                    select
                    name="hostel_status"
                    value={formData.hostel_status}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Home size={16} color="#94a3b8" /></InputAdornment>,
                      sx: inputStyles
                    }}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </TextField>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Address</Typography>
                  <TextField 
                    fullWidth 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Lahore"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><MapPin size={16} color="#94a3b8" /></InputAdornment>,
                      sx: inputStyles
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', mb: 1, textTransform: 'uppercase' }}>Guardian Name</Typography>
                  <TextField 
                    fullWidth 
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    placeholder="e.g. Ahmed Khan"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Users size={16} color="#94a3b8" /></InputAdornment>,
                      sx: inputStyles
                    }}
                  />
                </Box>
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
                  fontSize: '1rem',
                  textTransform: 'none',
                  bgcolor: '#8456f1',
                  boxShadow: '0 10px 25px rgba(132, 86, 241, 0.4)',
                  '&:hover': { bgcolor: '#7344e3', transform: 'translateY(-2px)', boxShadow: '0 15px 35px rgba(132, 86, 241, 0.5)' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  gap: 1.5
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
              </Button>
            </form>

            <Typography sx={{ mt: 3, textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
              Already have an account? <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} sx={{ color: '#8456f1', fontWeight: 900, textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Sign In</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
