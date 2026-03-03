import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import ProfileSidebar from '../../components/ProfileSidebar';
import AddMemberModal from '../../components/AddMemberModal';
import { useAuth } from '../../context/AuthContext';

const ADMIN_MENU = [
  { path: '/admin', label: 'Home' },
  { path: '/admin/house/jal', label: 'Jal' },
  { path: '/admin/house/vayu', label: 'Vayu' },
  { path: '/admin/house/agni', label: 'Agni' },
  { path: '/admin/house/prudhvi', label: 'Prudhvi' },
  { path: '/admin/house/akash', label: 'Akash' },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                <img src="/dept-logo.png" alt="Department Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">CSD & CSIT Department</h1>
                <p className="text-white/70 text-sm mt-1">House Event Management System</p>
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setMemberModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm sm:text-base font-medium hover:bg-white/30 transition"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>
      <FloatingNavbar menuItems={ADMIN_MENU} onProfileClick={() => setProfileOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
      <ProfileSidebar
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <AddMemberModal isOpen={memberModalOpen} onClose={() => setMemberModalOpen(false)} />
    </div>
  );
};

export default AdminLayout;
