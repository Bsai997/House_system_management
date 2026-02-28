import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ProfileSidebar from '../../components/ProfileSidebar';
import { useAuth } from '../../context/AuthContext';
import { HiBell } from 'react-icons/hi';

const ADMIN_LINKS = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/house/jal', label: 'Jal' },
  { path: '/admin/house/vayu', label: 'Vayu' },
  { path: '/admin/house/agni', label: 'Agni' },
  { path: '/admin/house/prudhvi', label: 'Prudhvi' },
  { path: '/admin/house/akash', label: 'Akash' },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
                  💻
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">CSD & CSIT Department</h1>
                <p className="text-white/70 text-sm mt-1">House Event Management System</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <button
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition"
                title="Notifications"
              >
                <HiBell size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Navbar links={ADMIN_LINKS} onProfileClick={() => setProfileOpen(true)} />
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

export default AdminLayout;
