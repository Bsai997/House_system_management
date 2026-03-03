import { useState } from 'react';
import { HiUser } from 'react-icons/hi';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FloatingNavbar from '../../components/FloatingNavbar';
import ProfileSidebar from '../../components/ProfileSidebar';
import AddMemberModal from '../../components/AddMemberModal';
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
  const location = useLocation();

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)' }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'orb1 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '-15%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'orb2 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '30%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'orb1 12s ease-in-out infinite reverse'
        }} />
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

      {/* ── HEADER ── */}
      <header style={{ position: 'relative', zIndex: 10, paddingTop: '24px', paddingBottom: '0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>

            {/* Left: Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Logo circle */}
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)'
              }}>
                <img src="/dept-logo.png" alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:24px">🏛️</span>'; }}
                />
              </div>

              {/* Text */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.3px' }}>
                    CSD &amp; CSIT Department
                  </h1>
                  <div className="header-pill">
                    <div className="status-dot"></div>
                    LIVE
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0, fontWeight: '500' }}>
                  🏆 House Event Management System · Admin Panel
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Date/Time pill */}
              <div className="header-pill" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px', borderRadius: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '600' }}>{timeString}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{dateString}</span>
              </div>

              {/* Add Member button */}
              <button className="add-member-btn" onClick={() => setMemberModalOpen(true)}>
                <span>＋</span>
                <span>Add Member</span>
              </button>

              {/* Profile icon button */}
              <button className="profile-btn" onClick={() => setProfileOpen(true)} title="View Profile">
                <HiUser size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Floating Navbar */}
        <FloatingNavbar menuItems={ADMIN_MENU} onProfileClick={() => setProfileOpen(true)} />
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content-area" style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px' }}>
        <Outlet />
      </main>

      <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <AddMemberModal isOpen={memberModalOpen} onClose={() => setMemberModalOpen(false)} />
    </div>
  );
};

export default AdminLayout;
