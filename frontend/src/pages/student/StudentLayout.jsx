import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import HeroSection from '../../components/HeroSection';
import ProfileSidebar from '../../components/ProfileSidebar';

const STUDENT_MENU = [
  { path: '/student', label: 'Home' },
  { path: '/student/participations', label: 'Event Participation' },
  { path: '/student/houseboard', label: 'Houseboard' },
  { path: '/student/leaderboard', label: 'Leaderboard' },
];

const StudentLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection subtitle="Explore events and earn points for your house" onProfileClick={() => setProfileOpen(true)} />
      <FloatingNavbar menuItems={STUDENT_MENU} onProfileClick={() => setProfileOpen(true)} />
      <div className="dashboard-content">
        <Outlet />
      </div>
      <ProfileSidebar
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
};

export default StudentLayout;
