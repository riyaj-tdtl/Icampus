import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, IconButton, Tooltip, Chip } from '@mui/material';
import { Plus, Users, UserPlus, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { parentService } from '../services/parent.service';
import { showComplexForm, showSuccess, showError } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';
import Swal from 'sweetalert2';

const ManageParents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [studentOptions, setStudentOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await parentService.getStudentsDropdown();
      const students = Array.isArray(data) ? data : (data.results || []);
      setStudentOptions(students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterParent = async () => {
    if (studentOptions.length === 0) {
      showError('No Students', 'No students found in the system. Please add students first.');
      return;
    }

    // Build checkbox HTML for multi-select children
    const childCheckboxesHtml = studentOptions.map(s => `
      <label style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; margin-bottom: 6px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s;"
        onmouseover="this.style.borderColor='#8456f1'; this.style.background='#faf5ff'"
        onmouseout="if(!this.querySelector('input').checked) { this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc'; }"
      >
        <input type="checkbox" class="child-checkbox" value="${s.id}" 
          style="width: 18px; height: 18px; accent-color: #8456f1; cursor: pointer; flex-shrink: 0;"
          onchange="if(this.checked) { this.parentElement.style.borderColor='#8456f1'; this.parentElement.style.background='#faf5ff'; } else { this.parentElement.style.borderColor='#e2e8f0'; this.parentElement.style.background='#f8fafc'; }"
        >
        <span style="font-weight: 600; color: #334155; font-size: 0.95rem;">${s.name}</span>
        <span style="margin-left: auto; font-size: 0.75rem; color: #94a3b8; font-weight: 500;">ID: ${s.id}</span>
      </label>
    `).join('');

    const { value: formValues } = await Swal.fire({
      title: '<div style="text-align: left; font-weight: 800; color: #1e293b; font-size: 1.25rem;">Register <span style="color: #8456f1;">Parent</span></div>',
      html: `
        <form autocomplete="off" style="display: flex; flex-direction: column; gap: 16px; text-align: left; padding: 8px 0;">
          <input type="text" name="hidden" autocomplete="off" style="display:none" />
          
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</label>
            <input id="swal-name" type="text" placeholder="e.g. John Smith" autocomplete="off"
              style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
            >
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Email</label>
              <input id="swal-email" type="email" placeholder="parent@email.com" autocomplete="off"
                style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s;"
                onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
              >
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</label>
              <input id="swal-phone" type="tel" placeholder="1234567890" autocomplete="off"
                style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s;"
                onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
              >
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Password</label>
            <input id="swal-password" type="password" placeholder="••••••••" autocomplete="new-password"
              style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
            >
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Address</label>
              <input id="swal-address" type="text" placeholder="e.g. Pune" autocomplete="off"
                style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s;"
                onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
              >
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Occupation</label>
              <input id="swal-occupation" type="text" placeholder="e.g. Software Engineer" autocomplete="off"
                style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; background: #f8fafc; transition: all 0.2s;"
                onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#fff'; this.style.boxShadow='0 0 0 4px rgba(132,86,241,0.1)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
              >
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Select Children</label>
            <div style="max-height: 200px; overflow-y: auto; padding-right: 4px;">
              ${childCheckboxesHtml}
            </div>
          </div>
        </form>
      `,
      width: '560px',
      background: '#ffffff',
      confirmButtonColor: '#8456f1',
      confirmButtonText: 'Register Parent',
      showCancelButton: true,
      cancelButtonColor: '#94a3b8',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const phone = document.getElementById('swal-phone').value.trim();
        const password = document.getElementById('swal-password').value.trim();
        const address = document.getElementById('swal-address').value.trim();
        const occupation = document.getElementById('swal-occupation').value.trim();
        const checkboxes = document.querySelectorAll('.child-checkbox:checked');
        const my_childs = Array.from(checkboxes).map(cb => parseInt(cb.value));

        if (!name || !email || !phone || !password) {
          Swal.showValidationMessage('Name, Email, Phone and Password are required.');
          return false;
        }
        if (my_childs.length === 0) {
          Swal.showValidationMessage('Please select at least one child.');
          return false;
        }

        return { name, email, phone, password, address, occupation, my_childs };
      }
    });

    if (formValues) {
      try {
        await parentService.register(formValues);
        showSuccess('Parent Registered!', `${formValues.name} has been registered with ${formValues.my_childs.length} child(ren).`);
      } catch (error) {
        const errData = error.response?.data;
        let msg = 'An error occurred while registering the parent.';
        if (errData) {
          if (typeof errData === 'string') msg = errData;
          else if (errData.detail) msg = errData.detail;
          else msg = Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
        }
        showError('Registration Failed', msg);
      }
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Manage Parents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Register parents and link them with their children in the system.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth={isMobile}
          startIcon={<UserPlus size={18} />} 
          sx={{ 
            borderRadius: '12px', 
            textTransform: 'none', 
            fontWeight: 800, 
            py: 1.5, 
            px: 3, 
            bgcolor: '#8456f1', 
            boxShadow: '0 8px 20px rgba(132, 86, 241, 0.3)',
            '&:hover': { bgcolor: '#7344e3' }
          }}
          onClick={handleRegisterParent}
        >
          Register Parent
        </Button>
      </Box>

      {/* Available Students for Reference */}
      <Paper sx={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#f0ebff', borderRadius: '12px', color: '#8456f1' }}>
            <Users size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>
              Available Students
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Students available for parent assignment
            </Typography>
          </Box>
          <Chip 
            label={`${studentOptions.length} Students`} 
            size="small" 
            sx={{ ml: 'auto', bgcolor: '#f0ebff', color: '#8456f1', fontWeight: 700, borderRadius: '8px' }} 
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 500 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Student Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton cols={2} rows={5} />
              ) : studentOptions.length > 0 ? (
                studentOptions.map((s) => (
                  <TableRow key={s.id} hover sx={{ transition: 'all 0.2s' }}>
                    <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>#{s.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 36, height: 36, borderRadius: '10px', 
                          bgcolor: '#f0ebff', color: '#8456f1',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem'
                        }}>
                          {s.name?.charAt(0)?.toUpperCase() || '?'}
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    No students found in the system.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ManageParents;
