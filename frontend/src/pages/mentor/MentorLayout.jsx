import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import HeroSection from '../../components/HeroSection';
import ProfileSidebar from '../../components/ProfileSidebar';
import AddTeamLeadModal from '../../components/AddTeamLeadModal';

const MENTOR_MENU = [
  { path: '/mentor', label: 'Approvals' },
  { path: '/mentor/about-house', label: 'About House' },
  { path: '/mentor/leaderboard', label: 'Leaderboard' },
];

const MentorLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [teamLeadModalOpen, setTeamLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        subtitle="Review events and monitor your house"
        actionButton={
          <button
            onClick={() => setTeamLeadModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm sm:text-base font-medium hover:bg-white/30 transition"
          >
            Add Team Lead
          </button>
        }
      />
      <FloatingNavbar menuItems={MENTOR_MENU} onProfileClick={() => setProfileOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
      <ProfileSidebar
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <AddTeamLeadModal isOpen={teamLeadModalOpen} onClose={() => setTeamLeadModalOpen(false)} />
    </div>
  );
};

export default MentorLayout;
