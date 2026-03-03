import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import HeroSection from '../../components/HeroSection';
import ProfileSidebar from '../../components/ProfileSidebar';

const TEAMLEAD_MENU = [
  { path: '/teamlead', label: 'Home' },
  { path: '/teamlead/history', label: 'Event History' },
  { path: '/teamlead/registrations', label: 'Registrations' },
  { path: '/teamlead/house-points', label: 'House Points' },
  { path: '/teamlead/leaderboard', label: 'Leaderboard' },
];

const TeamLeadLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection subtitle="Create events and manage your house" onProfileClick={() => setProfileOpen(true)} />
      <FloatingNavbar menuItems={TEAMLEAD_MENU} onProfileClick={() => setProfileOpen(true)} />
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

export default TeamLeadLayout;
