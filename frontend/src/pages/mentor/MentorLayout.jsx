import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import HeroSection from '../../components/HeroSection';
import ProfileSidebar from '../../components/ProfileSidebar';

const MENTOR_MENU = [
  { path: '/mentor', label: 'Approvals' },
  { path: '/mentor/about-house', label: 'About House' },
];

const MentorLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection subtitle="Review events and monitor your house" />
      <FloatingNavbar menuItems={MENTOR_MENU} onProfileClick={() => setProfileOpen(true)} />
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

export default MentorLayout;
