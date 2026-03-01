import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiUser } from 'react-icons/hi';
import { useState } from 'react';

const FloatingNavbar = ({ menuItems, onProfileClick }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex justify-center items-center mt-6 px-4 relative z-50">
      {/* Desktop Navbar */}
      <nav
        className="hidden md:flex items-center gap-2 lg:gap-6 px-6 lg:px-10 py-3 rounded-full
                    bg-gradient-to-r from-gray-900 via-gray-800 to-black
                    backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    border border-gray-700/50 max-w-[900px] w-auto
                    relative overflow-visible"
      >
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out
              whitespace-nowrap overflow-visible
              ${
                isActive(item.path)
                  ? 'text-white font-semibold bg-white/10'
                  : 'text-gray-400 hover:text-white hover:scale-105'
              }`}
          >
            {/* Spotlight line attached just below the navbar */}
            {isActive(item.path) && (
              <span
                className="spotlight-cone pointer-events-none absolute rounded-full"
                style={{
                  width: '70%',
                  height: '3px',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background:
                    'radial-gradient(ellipse at center, rgba(167,139,250,1) 0%, rgba(139,92,246,0.6) 40%, transparent 80%)',
                  boxShadow:
                    '0 0 6px 1px rgba(167,139,250,0.6), 0 0 14px 3px rgba(139,92,246,0.3), 0 2px 8px 2px rgba(167,139,250,0.15)',
                }}
              />
            )}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Profile Button - floating right */}
      {onProfileClick && (
        <button
          onClick={onProfileClick}
          className="hidden md:flex absolute right-6 lg:right-10 w-10 h-10 rounded-full
                     bg-gradient-to-r from-gray-900 via-gray-800 to-black
                     backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                     border border-gray-700/50
                     items-center justify-center text-gray-300
                     hover:bg-white/20 hover:text-white hover:scale-110
                     transition-all duration-300 cursor-pointer"
          title="Open profile"
        >
          <HiUser size={18} />
        </button>
      )}

      {/* Mobile Navbar */}
      <div className="md:hidden w-full max-w-md">
        <div
          className={`flex items-center justify-between px-5 py-3
                      bg-gradient-to-r from-gray-900 via-gray-800 to-black
                      backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                      border border-gray-700/50
                      ${mobileOpen ? 'rounded-t-3xl' : 'rounded-full'}`}
        >
          <span className="text-white text-sm font-semibold tracking-wide">Menu</span>
          <div className="flex items-center gap-2">
            {onProfileClick && (
              <button
                onClick={onProfileClick}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                           text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-300"
                title="Open profile"
              >
                <HiUser size={18} />
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                         text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div
            className="bg-gradient-to-b from-gray-800 to-gray-900
                        border border-t-0 border-gray-700/50 rounded-b-3xl
                        px-3 py-3 space-y-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                        overflow-x-auto"
          >
            {/* Scrollable pill row */}
            <div className="flex flex-wrap gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    whitespace-nowrap
                    ${
                      isActive(item.path)
                        ? 'text-white bg-white/15 font-semibold shadow-[0_0_12px_rgba(147,130,255,0.5)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingNavbar;
