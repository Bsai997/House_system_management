import { useState } from 'react';
import { HiUser } from 'react-icons/hi';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import ProfileSidebar from '../../components/ProfileSidebar';
import AddMemberModal from '../../components/AddMemberModal';
import AddAdminEventModal from '../../components/AddAdminEventModal';
import { useAuth } from '../../context/AuthContext';

const ADMIN_MENU = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/house/jal', label: 'Jal', color: '#3B82F6' },
  { path: '/admin/house/vayu', label: 'Vayu', color: '#8B5CF6' },
  { path: '/admin/house/agni', label: 'Agni', color: '#EF4444' },
  { path: '/admin/house/prudhvi', label: 'Prudhvi', color: '#22C55E' },
  { path: '/admin/house/akash', label: 'Akash', color: '#F59E0B' },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const location = useLocation();

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-white to-white text-gray-800 relative">
      {/* Subtle background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/3 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[125px] h-[125px] sm:w-[175px] sm:h-[175px] rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      <style>{`
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 20px) scale(1.08); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .admin-header-shimmer {
          background: linear-gradient(90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0) 100%
          );
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        .header-pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 6px 16px;
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .add-member-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          color: white;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 13px;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 15px rgba(99,102,241,0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .add-member-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .add-member-btn:hover::before { opacity: 1; }
        .add-member-btn:hover {
          box-shadow: 0 8px 25px rgba(99,102,241,0.6);
          transform: translateY(-1px);
        }
        .add-member-btn span { position: relative; z-index: 1; }
        .profile-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: linear-gradient(to right, #111827, #1f2937, #000000);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(55, 65, 81, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #d1d5db;
          font-size: 16px;
          font-weight: 700;
        }
        .profile-btn:hover {
          background: rgba(255,255,255,0.2);
          color: white;
          transform: scale(1.1);
        }
        .house-quick-nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .house-chip {
          padding: 4px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid;
        }
        .house-chip:hover {
          transform: scale(1.08);
          filter: brightness(1.2);
        }
        .main-content-area {
          animation: fadeSlideIn 0.5s ease forwards;
        }
        .status-dot {
          width: 8px; height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
          animation: pulse-border 2s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          margin: 0;
        }
      `}</style>

      {/* ── HEADER (Hero section) - White background ── */}
      <header className="relative z-10 bg-white border-b border-gray-100 pt-4 sm:pt-6 pb-4 sm:pb-5">
        <div className="w-full px-3 sm:px-6 lg:px-8">

          {/* Top row: Logo, Dept name, Add Member, Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">

            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden border-2 border-purple-100 shadow-md flex items-center justify-center bg-white">
                <img src="/dept-logo.png" alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:24px">🏛️</span>'; }}
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 m-0 tracking-tight truncate">
                  CSD &amp; CSIT Dept
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm m-0 font-medium hidden sm:block">
                  Where Learning Meets Innovation
                </p>
              </div>
            </div>

            {/* Right: Add Event + Add Member + Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="add-member-btn !px-3 !py-2 sm:!px-6 sm:!py-2.5 !text-sm sm:!text-base" onClick={() => setEventModalOpen(true)}>
                <span>＋</span>
                <span className="hidden sm:inline">Add Event</span>
                <span className="sm:hidden">Event</span>
              </button>
              <button className="add-member-btn !px-3 !py-2 sm:!px-6 sm:!py-2.5 !text-sm sm:!text-base" onClick={() => setMemberModalOpen(true)}>
                <span>＋</span>
                <span className="hidden sm:inline">Add Member</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={() => setProfileOpen(true)}
                title="View Profile"
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 hover:scale-105"
              >
                <HiUser size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Floating Navbar */}
       
      </header>


      {/* Floating Navbar below Hero section */}
      <div className="flex justify-center w-full px-2 sm:px-4 mt-2 mb-4">
        <FloatingNavbar menuItems={ADMIN_MENU} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content-area relative z-10 w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-12 sm:pb-16">
        <Outlet />
      </main>

      <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <AddMemberModal isOpen={memberModalOpen} onClose={() => setMemberModalOpen(false)} />
      <AddAdminEventModal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} />
    </div>
  );
};

export default AdminLayout;
