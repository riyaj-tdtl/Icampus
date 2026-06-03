import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography } from '@mui/material';

const RoleGuard = ({ children, allowedRoles }) => {
  const { role } = useAuth();

  // Normalize SUPER_ADMIN to ADMIN
  const userRole = role === 'SUPER_ADMIN' ? 'ADMIN' : role;
  const mappedAllowedRoles = allowedRoles.map(r => r === 'SUPER_ADMIN' ? 'ADMIN' : r);

  if (!mappedAllowedRoles.includes(userRole)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" sx={{ fontWeight: 'bold', mb: 2 }}>Unauthorized Access</Typography>
        <Typography variant="body1">You do not have permission to view this page.</Typography>
      </Box>
    );
  }

  return children;
};

export default RoleGuard;
