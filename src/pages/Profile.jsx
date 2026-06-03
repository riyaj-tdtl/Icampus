import { Box, Typography, Card, CardContent, Avatar, Grid, Divider, Button, Chip } from '@mui/material';
import { Mail, Phone, MapPin, Briefcase, Calendar, Shield, Edit3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'ADMIN';
  const displayFirstName = user.first_name || user.name || user.username || 'Admin';
  const displayLastName = user.last_name || (!user.name ? 'User' : '');
  const displayName = `${displayFirstName} ${displayLastName}`.trim();

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>
          Back
        </Button>
      </Box>
      {/* Cover and Header */}
      <Card sx={{ borderRadius: '24px', overflow: 'hidden', mb: 4, position: 'relative' }}>
        <Box sx={{ height: 200, bgcolor: 'primary.main', background: 'linear-gradient(135deg, #8456f1 0%, #4f46e5 100%)' }} />
        <CardContent sx={{ position: 'relative', pt: 0, px: { xs: 3, md: 5 }, pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, mt: -7, gap: 3 }}>
            <Avatar 
              sx={{ 
                width: 140, 
                height: 140, 
                border: '4px solid white', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                bgcolor: '#f1f5f9',
                color: 'primary.main',
                fontSize: '3rem',
                fontWeight: 800
              }}
            >
              {displayFirstName[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' }, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                {displayName}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
                <Briefcase size={18} /> {role.replace('_', ' ')}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Button variant="contained" startIcon={<Edit3 size={18} />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#1e293b' }}>
                Edit Profile
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Contact Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '20px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Contact Information</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(132, 86, 241, 0.1)', color: '#8456f1' }}><Mail size={20} /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Email Address</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.email || 'admin@icampus.com'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Phone size={20} /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Phone Number</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.phone || 'Not provided'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><MapPin size={20} /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Location</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.address || 'Campus Portal'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '20px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Account Security</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 200px', p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Shield size={16} /> Status
                  </Typography>
                  <Chip label="Verified Account" size="small" color="success" sx={{ fontWeight: 700 }} />
                </Box>
                <Box sx={{ flex: '1 1 200px', p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Calendar size={16} /> Joined On
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>September 12, 2023</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Bio & Details</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  This static profile summarizes the account currently signed in to iCampus. Use it as a quick reference for role, contact information, and verified portal access.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
