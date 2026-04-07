import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import HeroSection from '../../components/HeroSection';
import ProfileSidebar from '../../components/ProfileSidebar';
import AddPointsModal from '../../components/AddPointsModal';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor } from '../../utils/constants';
import { HiPlus } from 'react-icons/hi';

const TEAMLEAD_MENU = [
  { path: '/teamlead', label: 'Home' },
  { path: '/teamlead/history', label: 'Event History' },
  { path: '/teamlead/registrations', label: 'Registrations' },
  { path: '/teamlead/house-points', label: 'House Points' },
  { path: '/teamlead/leaderboard', label: 'Leaderboard' },
];

const TeamLeadLayout = () => {
  const { user } = useAuth();
  const houseColors = getHouseColor(user?.house?.name);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);

  const addPointsButton = (
    <button
      onClick={() => setPointsModalOpen(true)}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.3)',
      }}
    >
      <HiPlus size={16} />
      Add Points
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        subtitle="Create events and manage your house"
        onProfileClick={() => setProfileOpen(true)}
        actionButton={addPointsButton}
      />
      <FloatingNavbar menuItems={TEAMLEAD_MENU} onProfileClick={() => setProfileOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
      <ProfileSidebar
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <AddPointsModal
        isOpen={pointsModalOpen}
        onClose={() => setPointsModalOpen(false)}
      />
    </div>
  );
};

export default TeamLeadLayout;
