import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import AttendancePage from './pages/AttendancePage';
import Academics from './pages/Academics';
import Examinations from './pages/Examinations';
import Finance from './pages/Finance';
import Communication from './pages/Communication';
import Assessments from './pages/Assessments';
import Timetable from './pages/Timetable';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Visitors from './pages/Visitors';
import Library from './pages/Library';
import HR from './pages/HR';
import Hostel from './pages/Hostel';
import Transport from './pages/Transport';
import Homework from './pages/Homework';
import Profile from './pages/Profile';
import ActivityLog from './pages/ActivityLog';
import Programs from './pages/Programs';
import StudentApprovals from './pages/StudentApprovals';
import ManageParents from './pages/ManageParents';
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentHomework from './pages/parent/ParentHomework';
import ParentTimetable from './pages/parent/ParentTimetable';
import ParentExams from './pages/parent/ParentExams';
import ParentPrograms from './pages/parent/ParentPrograms';
import Complaints from './pages/Complaints';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin-portal" element={<ProtectedRoute><RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}><MainLayout /></RoleGuard></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/approvals" element={<StudentApprovals />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="hr" element={<HR />} />
        <Route path="homework" element={<Homework />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="academics" element={<Academics />} />
        <Route path="examinations" element={<Examinations />} />
        <Route path="finance" element={<Finance />} />
        <Route path="library" element={<Library />} />
        <Route path="transport" element={<Transport />} />
        <Route path="hostel" element={<Hostel />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="communication" element={<Communication />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="activity-log" element={<ActivityLog />} />
        <Route path="programs" element={<Programs />} />
        <Route path="parents" element={<ManageParents />} />
        <Route path="complaints" element={<Complaints />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher-portal" element={<ProtectedRoute><RoleGuard allowedRoles={['TEACHER']}><MainLayout /></RoleGuard></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/approvals" element={<StudentApprovals />} />
        <Route path="homework" element={<Homework />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="academics" element={<Academics />} />
        <Route path="examinations" element={<Examinations />} />
        <Route path="communication" element={<Communication />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="activity-log" element={<ActivityLog />} />
        <Route path="programs" element={<Programs />} />
        <Route path="parents" element={<ManageParents />} />
        <Route path="complaints" element={<Complaints />} />
      </Route>

      {/* Parent Routes */}
      <Route path="/parent-portal" element={<ProtectedRoute><RoleGuard allowedRoles={['PARENT']}><MainLayout /></RoleGuard></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="homework" element={<ParentHomework />} />
        <Route path="timetable" element={<ParentTimetable />} />
        <Route path="examinations" element={<ParentExams />} />
        <Route path="programs" element={<ParentPrograms />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student-portal" element={<ProtectedRoute><RoleGuard allowedRoles={['STUDENT']}><MainLayout /></RoleGuard></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="homework" element={<Homework />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="examinations" element={<Examinations />} />
        <Route path="library" element={<Library />} />
        <Route path="transport" element={<Transport />} />
        <Route path="hostel" element={<Hostel />} />
        <Route path="communication" element={<Communication />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="profile" element={<Profile />} />
        <Route path="activity-log" element={<ActivityLog />} />
        <Route path="programs" element={<Programs />} />
        <Route path="complaints" element={<Complaints />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
