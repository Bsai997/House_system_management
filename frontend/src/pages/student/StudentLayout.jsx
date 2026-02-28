import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import ProfileSidebar from '../../components/ProfileSidebar';

const STUDENT_LINKS = [
  { path: '/student', label: 'Home' },
  { path: '/student/participations', label: 'Event Participation' },
  { path: '/student/houseboard', label: 'Houseboard' },
  { path: '/student/leaderboard', label: 'Leaderboard' },
];

const StudentLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection subtitle="Explore events and earn points for your house" />
      <Navbar links={STUDENT_LINKS} onProfileClick={() => setProfileOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
