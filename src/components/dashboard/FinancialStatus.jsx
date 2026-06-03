import { Card, CardContent, Typography, Box, Button, LinearProgress } from '@mui/material';
import { Wallet, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { confirmAction, showSuccess } from '../../utils/swalUtils';

const FinancialStatus = ({ pendingRevenue, totalRevenue }) => {
  const displayPending = pendingRevenue !== undefined ? pendingRevenue : 1240;
  const displayTotal = totalRevenue !== undefined ? totalRevenue : 50000;

  return (
    <Card 
      component={motion.div}
      whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: '20px' }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Wallet size={20} color="#8456f1" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Financial Overview
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Pending Balance
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography 
              component={motion.h2}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              variant="h3" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-1px' }}
            >
              ${displayPending.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Revenue
              </Typography>
              <Typography variant="body2" sx={{ color: '#8456f1', fontWeight: 800 }}>
                ${displayTotal.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: 'rgba(132, 86, 241, 0.2)',
                '& .MuiLinearProgress-bar': { bgcolor: '#8456f1', borderRadius: 4 }
              }} 
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Collected Ratio
              </Typography>
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 800 }}>
                {displayTotal > 0 ? Math.round(((displayTotal - displayPending) / displayTotal) * 100) : 100}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={displayTotal > 0 ? ((displayTotal - displayPending) / displayTotal) * 100 : 100} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: 'rgba(16, 185, 129, 0.2)',
                '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 4 }
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Button 
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variant="contained" 
            fullWidth 
            startIcon={<CreditCard size={18} />}
            sx={{ 
              bgcolor: '#8456f1', 
              '&:hover': { bgcolor: '#6e44c4' },
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem'
            }}
            onClick={() => {
              confirmAction('Pay Outstanding Dues', 'Are you sure you want to proceed to the payment gateway to clear the pending fees?', 'Proceed to Payment').then(res => {
                if (res.isConfirmed) {
                  showSuccess('Payment Initiated', 'You are being redirected to the secure portal.');
                }
              })
            }}
          >
            Manage Payments
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialStatus;
