import { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { Users, CalendarCheck, BookOpen, FileText, AlertTriangle, Building2, ChevronRight, TrendingUp, Clock, Star, Eye, Calendar, Pencil, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parentService } from '../../services/parent.service';

/* ── tiny reusable sparkline ── */
const MiniSparkline = ({ value = 75, color = '#8456f1' }) => {
  const points = Array.from({ length: 7 }, (_, i) => {
    const base = value / 100;
    const noise = Math.sin(i * 1.2 + value) * 15 + Math.cos(i * 0.8) * 10;
    return Math.max(5, Math.min(45, 25 + noise * base));
  });
  const pathD = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 16},${50 - y}`).join(' ');
  return (
    <svg width="96" height="50" viewBox="0 0 96 50" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${pathD} L96,50 L0,50 Z`} fill={`url(#spark-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ── animated counter ── */
const AnimatedNumber = ({ target, suffix = '', prefix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const num = parseFloat(target) || 0;
    let frame;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setVal(Math.round(ease * num));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{prefix}{val}{suffix}</>;
};

/* ── premium child card ── */
const ChildCard = ({ child, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const pct = child.attendance_percentage || 0;
  const attendanceColor = pct >= 90 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444';
  const hwTotal = child.homework?.total || 0;
  const hwUpcoming = child.homework?.upcoming || 0;
  const exTotal = child.exams?.total || 0;
  const complaints = child.complaints || 0;

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? '0 25px 60px rgba(132, 86, 241, 0.2), 0 0 0 1px rgba(132, 86, 241, 0.1)'
          : '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
        bgcolor: 'background.paper',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '4px',
          background: gradients[index % gradients.length],
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.3s',
        }
      }}
    >
      {/* Card Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: gradients[index % gradients.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: '1.4rem',
            boxShadow: `0 8px 24px ${['rgba(102,126,234,0.4)', 'rgba(240,147,251,0.4)', 'rgba(79,172,254,0.4)', 'rgba(67,233,123,0.4)', 'rgba(250,112,154,0.4)'][index % 5]}`,
            transition: 'transform 0.3s',
            transform: hovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0)',
          }}>
            {child.student_name?.charAt(0)?.toUpperCase() || '?'}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {child.student_name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={`Class ${child.class}`}
                size="small"
                sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 700,
                  bgcolor: '#f0ebff', color: '#8456f1', borderRadius: '6px',
                }}
              />
              <Chip
                label={`ID: ${child.student_id}`}
                size="small"
                sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600,
                  bgcolor: '#f1f5f9', color: '#94a3b8', borderRadius: '6px',
                }}
              />
            </Box>
          </Box>
          <Tooltip title="View Details" arrow>
            <IconButton
              size="small"
              sx={{
                bgcolor: hovered ? '#8456f1' : '#f8fafc',
                color: hovered ? '#fff' : '#94a3b8',
                transition: 'all 0.3s',
                '&:hover': { bgcolor: '#8456f1', color: '#fff' },
              }}
            >
              <ChevronRight size={18} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Attendance Section */}
        <Box sx={{
          p: 2, borderRadius: '16px',
          background: `linear-gradient(135deg, ${attendanceColor}08 0%, ${attendanceColor}04 100%)`,
          border: `1px solid ${attendanceColor}15`,
          mb: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarCheck size={16} color={attendanceColor} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Attendance Rate
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp size={14} color={attendanceColor} />
              <Typography sx={{ fontWeight: 900, color: attendanceColor, fontSize: '1.1rem', lineHeight: 1 }}>
                <AnimatedNumber target={pct} suffix="%" />
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 8, borderRadius: 10,
              bgcolor: `${attendanceColor}12`,
              '& .MuiLinearProgress-bar': {
                borderRadius: 10,
                background: `linear-gradient(90deg, ${attendanceColor} 0%, ${attendanceColor}cc 100%)`,
                transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }
            }}
          />
        </Box>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {[
            { icon: <BookOpen size={16} />, label: 'Homework', value: hwTotal, sub: hwUpcoming > 0 ? `${hwUpcoming} upcoming` : null, color: '#3b82f6', path: '/parent-portal/homework' },
            { icon: <FileText size={16} />, label: 'Exams', value: exTotal, sub: (child.exams?.upcoming || 0) > 0 ? `${child.exams.upcoming} upcoming` : null, color: '#8b5cf6', path: '/parent-portal/examinations' },
            { icon: <AlertTriangle size={16} />, label: 'Complaints', value: complaints, color: complaints > 0 ? '#ef4444' : '#10b981', alert: complaints > 0, path: '/parent-portal/complaints' },
            { icon: <Building2 size={16} />, label: 'Hostel', value: child.hostel?.status === 'Not Allocated' ? '—' : child.hostel?.room_number || '—', isText: true, color: '#06b6d4', path: '/parent-portal/dashboard' },
          ].map((stat, idx) => (
            <Box
              key={idx}
              sx={{
                p: 1.5, borderRadius: '12px',
                bgcolor: `${stat.color}06`,
                border: `1px solid ${stat.color}10`,
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  bgcolor: `${stat.color}10`,
                  borderColor: `${stat.color}25`,
                  transform: 'scale(1.03)',
                },
              }}
            >
              {stat.alert && (
                <Box sx={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  bgcolor: '#ef4444',
                  animation: 'pulse-dot 2s infinite',
                  '@keyframes pulse-dot': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.5)' },
                  },
                }} />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5, color: stat.color }}>
                {stat.icon}
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: stat.isText ? '0.8rem' : '1.15rem', lineHeight: 1.2 }}>
                {stat.isText ? (child.hostel?.status || 'N/A') : <AnimatedNumber target={stat.value} />}
              </Typography>
              {stat.sub && (
                <Typography sx={{ fontSize: '0.6rem', color: stat.color, fontWeight: 600, mt: 0.25 }}>{stat.sub}</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ── Quick Access Action Button ── */
const QuickAction = ({ icon, label, desc, color, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        p: 2.5, borderRadius: '16px',
        bgcolor: 'background.paper',
        border: '1px solid #f1f5f9',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', alignItems: 'center', gap: 2,
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        boxShadow: hovered ? `0 8px 24px ${color}15` : '0 1px 4px rgba(0,0,0,0.04)',
        '&:hover': { borderColor: `${color}30` },
      }}
    >
      <Box sx={{
        width: 44, height: 44, borderRadius: '12px',
        bgcolor: `${color}10`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s',
        transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{desc}</Typography>
      </Box>
      <ChevronRight size={16} color={hovered ? color : '#cbd5e1'} style={{ transition: 'color 0.3s' }} />
    </Box>
  );
};

/* ═══════════════════════════ MAIN DASHBOARD ═══════════════════════════ */

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user.name || user.first_name || 'Parent';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await parentService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch parent dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();

    // Live clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ pb: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '28px', mb: 4 }} animation="wave" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: '20px' }} animation="wave" />
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" height={340} sx={{ borderRadius: '24px' }} animation="wave" />
          ))}
        </Box>
      </Box>
    );
  }

  const children = dashboardData?.children || [];
  const parentInfo = dashboardData?.parent || {};
  const totalChildren = dashboardData?.total_children || children.length;
  const avgAttendance = children.length > 0
    ? (children.reduce((sum, c) => sum + (c.attendance_percentage || 0), 0) / children.length).toFixed(0)
    : 0;
  const totalComplaints = children.reduce((sum, c) => sum + (c.complaints || 0), 0);
  const totalHomework = children.reduce((sum, c) => sum + (c.homework?.total || 0), 0);

  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Box sx={{ pb: 4 }}>
      {/* ── Hero Welcome Section ── */}
      <Box sx={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        mb: 4,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #6d28d9 100%)',
        minHeight: { xs: 200, md: 220 },
      }}>
        {/* Decorative orbs */}
        <Box sx={{
          position: 'absolute', top: -60, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,139,255,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -80, left: '30%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        <Box sx={{
          position: 'absolute', top: '50%', right: '10%',
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-15px)' },
          },
        }} />

        <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{
                px: 1.5, py: 0.5, borderRadius: '8px',
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Parent Portal
                </Typography>
              </Box>
              <Box sx={{
                px: 1.5, py: 0.5, borderRadius: '8px',
                bgcolor: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.5px' }}>
                  ● Live
                </Typography>
              </Box>
            </Box>

            <Typography sx={{
              color: '#fff', fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.4rem' },
              lineHeight: 1.1, mb: 1, letterSpacing: '-1px',
            }}>
              {greeting}, {displayName}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '1rem', maxWidth: 480 }}>
              Track your children's academic journey in real-time. Stay informed, stay involved.
            </Typography>
          </Box>

          {/* Live Clock / Date */}
          <Box sx={{
            p: 2.5, borderRadius: '20px',
            bgcolor: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center', minWidth: 160,
            display: { xs: 'none', lg: 'block' },
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '2rem', lineHeight: 1, letterSpacing: '-1px' }}>
              {currentTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.8rem', mt: 0.5 }}>
              {currentTime.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Quick Stats Row ── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 2, mb: 4,
      }}>
        {[
          { label: 'Children', value: totalChildren, icon: <Users size={20} />, color: '#8456f1', sparkVal: 90 },
          { label: 'Avg. Attendance', value: avgAttendance, suffix: '%', icon: <CalendarCheck size={20} />, color: '#10b981', sparkVal: avgAttendance },
          { label: 'Total Homework', value: totalHomework, icon: <BookOpen size={20} />, color: '#3b82f6', sparkVal: 65 },
          { label: 'Complaints', value: totalComplaints, icon: <AlertTriangle size={20} />, color: totalComplaints > 0 ? '#ef4444' : '#10b981', sparkVal: totalComplaints > 0 ? 30 : 85 },
        ].map((stat, idx) => (
          <Box
            key={idx}
            sx={{
              p: 2.5, borderRadius: '20px',
              bgcolor: 'background.paper',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.3s',
              cursor: 'default',
              overflow: 'hidden',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${stat.color}12`,
                borderColor: `${stat.color}25`,
              },
            }}
          >
            <Box sx={{ zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.8rem', lineHeight: 1, letterSpacing: '-1px' }}>
                <AnimatedNumber target={stat.value} suffix={stat.suffix || ''} />
              </Typography>
            </Box>
            <Box sx={{ opacity: 0.6, zIndex: 0 }}>
              <MiniSparkline value={stat.sparkVal} color={stat.color} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── Children Cards + Quick Access ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 4 }}>
        {/* Children Cards */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>
                Your Children
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                Click any card to view detailed reports
              </Typography>
            </Box>
            <Chip
              label={`${children.length} Active`}
              size="small"
              sx={{ bgcolor: '#f0fdf4', color: '#10b981', fontWeight: 700, borderRadius: '8px' }}
            />
          </Box>

          {children.length > 0 ? (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}>
              {children.map((child, idx) => (
                <ChildCard
                  key={child.student_id}
                  child={child}
                  index={idx}
                  onClick={() => navigate('/parent-portal/attendance')}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{
              p: 6, textAlign: 'center', bgcolor: 'background.paper',
              borderRadius: '24px', border: '1px dashed #e2e8f0',
            }}>
              <Users size={48} color="#cbd5e1" />
              <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 700 }}>No children linked</Typography>
              <Typography variant="body2" color="text.secondary">Please contact your school administrator.</Typography>
            </Box>
          )}
        </Box>

        {/* Quick Access Sidebar */}
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem', mb: 1 }}>
            Quick Access
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500, mb: 3 }}>
            Navigate to key sections
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <QuickAction
              icon={<CalendarCheck size={20} />}
              label="Attendance"
              desc="View daily records"
              color="#10b981"
              onClick={() => navigate('/parent-portal/attendance')}
            />
            <QuickAction
              icon={<Pencil size={20} />}
              label="Homework"
              desc="Track assignments"
              color="#3b82f6"
              onClick={() => navigate('/parent-portal/homework')}
            />
            <QuickAction
              icon={<Clock size={20} />}
              label="Timetable"
              desc="Class schedules"
              color="#8b5cf6"
              onClick={() => navigate('/parent-portal/timetable')}
            />
            <QuickAction
              icon={<FileText size={20} />}
              label="Examinations"
              desc="Upcoming tests"
              color="#f59e0b"
              onClick={() => navigate('/parent-portal/examinations')}
            />
            <QuickAction
              icon={<Calendar size={20} />}
              label="Programs"
              desc="School events"
              color="#ec4899"
              onClick={() => navigate('/parent-portal/programs')}
            />
            <QuickAction
              icon={<Shield size={20} />}
              label="Complaints"
              desc={totalComplaints > 0 ? `${totalComplaints} active` : 'All clear'}
              color={totalComplaints > 0 ? '#ef4444' : '#10b981'}
              onClick={() => navigate('/parent-portal/complaints')}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentDashboard;
