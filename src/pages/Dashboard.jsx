import { useState, useEffect } from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import { Calendar, CheckSquare, BookOpen, Users, FileText, Home, ClipboardList, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpcomingExaminations from '../components/dashboard/UpcomingExaminations';
import { dashboardService } from '../services/dashboard.service';
import Swal from 'sweetalert2';

const MetricCard = ({ title, value, icon, color, onClick }) => (
  <Box
    component={onClick ? 'button' : 'div'}
    type={onClick ? 'button' : undefined}
    onClick={onClick}
    sx={{
      p: 3,
      width: '100%',
      bgcolor: 'background.paper',
      borderRadius: '16px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      textAlign: 'left',
      font: 'inherit',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      '&:hover': onClick ? {
        transform: 'translateY(-2px)',
        borderColor: `${color}55`,
        boxShadow: `0 12px 28px ${color}18`
      } : undefined,
      '&:focus-visible': onClick ? {
        outline: `3px solid ${color}44`,
        outlineOffset: 3
      } : undefined
    }}
  >
    <Box sx={{ p: 1.5, bgcolor: `${color}15`, color: color, borderRadius: '12px' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>{value}</Typography>
    </Box>
  </Box>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('Oct 24, 2024');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';
  const isTeacher = user.role === 'TEACHER';
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

  // Read first and last name dynamically from session localStorage data
  const displayFirstName = user.first_name || user.username || 'User';
  const portalPrefix = isStudent ? '/student-portal' : (isTeacher ? '/teacher-portal' : '/admin-portal');
  const goToSection = (section) => () => navigate(`${portalPrefix}/${section}`);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        let data = null;
        if (isAdmin) {
          data = await dashboardService.getAdminDashboard();
        } else if (isTeacher) {
          data = await dashboardService.getTeacherDashboard();
        } else if (isStudent) {
          data = await dashboardService.getStudentDashboard();
        }
        setDashboardData(data?.data || data || {});
      } catch (err) {
        console.error('Failed to fetch premium dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user.role, isAdmin, isStudent, isTeacher]);

  const handleOpenTodo = () => {
    let todos = JSON.parse(localStorage.getItem('campus_todos') || '[]');
    
    const renderTodoList = () => {
      if (todos.length === 0) return '<div style="color: #64748b; padding: 20px; text-align: center;">No tasks pending. You\'re all caught up! 🎉</div>';
      return todos.map((todo, idx) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; margin-bottom: 8px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="todo-${idx}" ${todo.completed ? 'checked' : ''} onchange="window.toggleTodo(${idx})" style="width: 18px; height: 18px; accent-color: #8456f1; cursor: pointer;">
            <label for="todo-${idx}" style="cursor: pointer; margin: 0; font-weight: 500; color: ${todo.completed ? '#94a3b8' : '#334155'}; text-decoration: ${todo.completed ? 'line-through' : 'none'};">${todo.text}</label>
          </div>
          <button onclick="window.deleteTodo(${idx})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; border-radius: 4px; font-size: 1.2rem; line-height: 1;">&times;</button>
        </div>
      `).join('');
    };

    window.toggleTodo = (idx) => {
      todos[idx].completed = !todos[idx].completed;
      localStorage.setItem('campus_todos', JSON.stringify(todos));
      document.getElementById('todo-list-container').innerHTML = renderTodoList();
    };

    window.deleteTodo = (idx) => {
      todos.splice(idx, 1);
      localStorage.setItem('campus_todos', JSON.stringify(todos));
      document.getElementById('todo-list-container').innerHTML = renderTodoList();
    };

    window.addTodo = () => {
      const input = document.getElementById('new-todo-input');
      const text = input.value.trim();
      if (text) {
        todos.unshift({ text, completed: false });
        localStorage.setItem('campus_todos', JSON.stringify(todos));
        input.value = '';
        document.getElementById('todo-list-container').innerHTML = renderTodoList();
      }
    };

    Swal.fire({
      title: '<div style="text-align: left; font-weight: 800; color: #1e293b; font-size: 1.25rem;"><span style="color: #8456f1;">My</span> Tasks</div>',
      html: `
        <div style="margin-top: 10px; text-align: left;">
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <input type="text" id="new-todo-input" placeholder="What needs to be done?" style="flex: 1; padding: 10px 15px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-family: inherit; font-size: 0.95rem;">
            <button onclick="window.addTodo()" style="background: #8456f1; color: white; border: none; padding: 0 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Add</button>
          </div>
          <div id="todo-list-container" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
            ${renderTodoList()}
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '450px',
      background: '#ffffff',
      customClass: {
        popup: 'premium-swal-popup'
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ pb: 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
          <Skeleton variant="text" width={220} height={36} animation="wave" />
          <Skeleton variant="text" width={380} height={20} animation="wave" />
        </Box>

        {/* Dashboard Cards Grid Skeleton */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          {[1, 2, 3].map((cardId) => (
            <Box key={cardId} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', minHeight: 280 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={20} height={20} animation="wave" />
                  <Skeleton variant="text" width={120} height={24} animation="wave" />
                </Box>
                <Skeleton variant="text" width={60} height={20} animation="wave" />
              </Box>
              
              <Skeleton variant="rectangular" height={130} sx={{ borderRadius: '12px', mb: 2 }} animation="wave" />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: '8px' }} animation="wave" />
                <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: '8px' }} animation="wave" />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

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
            {isStudent ? 'Student Dashboard' : (isTeacher ? 'Faculty Dashboard' : 'Campus Overview')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent 
              ? `Welcome back, ${displayFirstName}. Here is your academic summary.`
              : (isTeacher 
                 ? `Welcome back, Prof. ${displayFirstName}. Here are your classes and tasks.` 
                 : `Welcome back, Admin ${displayFirstName}. Here's what's happening today.`)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="outlined" 
            startIcon={<Calendar size={18} />} 
            sx={{ 
              borderRadius: '10px', 
              color: 'text.secondary', 
              borderColor: 'divider',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              position: 'relative',
              flex: 1
            }}
            onClick={() => document.getElementById('global-date-picker').showPicker()}
          >
            {selectedDate}
            <input 
              id="global-date-picker"
              type="date" 
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} 
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  setSelectedDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                }
              }}
            />
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CheckSquare size={18} />}
            sx={{ 
              bgcolor: '#8456f1', 
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(132, 86, 241, 0.25)',
              px: { xs: 2, sm: 3 },
              '&:hover': {
                bgcolor: '#6e44c4'
              }
            }}
            onClick={handleOpenTodo}
          >
            Tasks
          </Button>
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, 
          gap: 3 
        }}
      >
        {isStudent && (
          <>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Pending Homework" value={dashboardData?.homework_count || 0} icon={<BookOpen size={24} />} color="#3b82f6" onClick={goToSection('homework')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Upcoming Exams" value={dashboardData?.upcoming_exams || 0} icon={<FileText size={24} />} color="#8b5cf6" onClick={goToSection('examinations')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Programs/Events" value={dashboardData?.programs_count || 0} icon={<Calendar size={24} />} color="#10b981" onClick={goToSection('programs')} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3', lg: 'span 3' } }}>
              <UpcomingExaminations />
            </Box>
          </>
        )}

        {isTeacher && (
          <>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Assigned Homework" value={dashboardData?.homework_count || 0} icon={<BookOpen size={24} />} color="#3b82f6" onClick={goToSection('homework')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Pending Students" value={dashboardData?.pending_students || 0} icon={<AlertCircle size={24} />} color="#f59e0b" onClick={goToSection('students')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Upcoming Exams" value={dashboardData?.upcoming_exams || 0} icon={<FileText size={24} />} color="#8b5cf6" onClick={goToSection('examinations')} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3', lg: 'span 3' } }}>
              <UpcomingExaminations />
            </Box>
          </>
        )}

        {!isStudent && !isTeacher && (
          <>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Total Students" value={dashboardData?.total_students || 0} icon={<Users size={24} />} color="#3b82f6" onClick={goToSection('students')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Total Teachers" value={dashboardData?.total_teachers || 0} icon={<ClipboardList size={24} />} color="#10b981" onClick={goToSection('teachers')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Pending Approvals" value={dashboardData?.pending_approvals || 0} icon={<AlertCircle size={24} />} color="#f59e0b" onClick={goToSection('students/approvals')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Total Exams" value={dashboardData?.exams_count || 0} icon={<FileText size={24} />} color="#8b5cf6" onClick={goToSection('examinations')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Programs Count" value={dashboardData?.programs_count || 0} icon={<Calendar size={24} />} color="#ec4899" onClick={goToSection('programs')} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
              <MetricCard title="Hostel Occupancy" value={`${dashboardData?.hostel_occupancy || 0}%`} icon={<Home size={24} />} color="#06b6d4" onClick={goToSection('hostel')} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3', lg: 'span 3' } }}>
              <UpcomingExaminations />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
