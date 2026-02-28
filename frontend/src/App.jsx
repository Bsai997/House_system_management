import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';

// Student
import StudentLayout from './pages/student/StudentLayout';
import StudentHome from './pages/student/StudentHome';
import StudentParticipations from './pages/student/StudentParticipations';
import StudentHouseboard from './pages/student/StudentHouseboard';
import StudentLeaderboard from './pages/student/StudentLeaderboard';

// Team Lead
import TeamLeadLayout from './pages/teamlead/TeamLeadLayout';
import TeamLeadHome from './pages/teamlead/TeamLeadHome';
import TeamLeadHistory from './pages/teamlead/TeamLeadHistory';
import TeamLeadRegistrations from './pages/teamlead/TeamLeadRegistrations';
import TeamLeadHousePoints from './pages/teamlead/TeamLeadHousePoints';
import TeamLeadLeaderboard from './pages/teamlead/TeamLeadLeaderboard';

// Mentor
import MentorLayout from './pages/mentor/MentorLayout';
import MentorApprovals from './pages/mentor/MentorApprovals';
import MentorAboutHouse from './pages/mentor/MentorAboutHouse';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHouseView from './pages/admin/AdminHouseView';

// Root redirect based on role
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentHome />} />
            <Route path="participations" element={<StudentParticipations />} />
            <Route path="houseboard" element={<StudentHouseboard />} />
            <Route path="leaderboard" element={<StudentLeaderboard />} />
          </Route>

          {/* Team Lead Routes */}
          <Route
            path="/teamlead"
            element={
              <ProtectedRoute roles={['teamlead']}>
                <TeamLeadLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeamLeadHome />} />
            <Route path="history" element={<TeamLeadHistory />} />
            <Route path="registrations" element={<TeamLeadRegistrations />} />
            <Route path="house-points" element={<TeamLeadHousePoints />} />
            <Route path="leaderboard" element={<TeamLeadLeaderboard />} />
          </Route>

          {/* Mentor Routes */}
          <Route
            path="/mentor"
            element={
              <ProtectedRoute roles={['mentor']}>
                <MentorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MentorApprovals />} />
            <Route path="about-house" element={<MentorAboutHouse />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="house/:houseName" element={<AdminHouseView />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
