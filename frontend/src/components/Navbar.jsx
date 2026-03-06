import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHouseColor } from '../utils/constants';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = ({ links, onProfileClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const houseName = user?.house?.name;
  const houseColors = houseName ? getHouseColor(houseName) : null;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Spacer for centering */}
          <div className="hidden md:block w-48" />

          {/* Desktop Links - centered */}
          <div className="hidden md:flex items-center gap-2 justify-center flex-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? houseColors
                      ? `${houseColors.bgLight} ${houseColors.text}`
                      : 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile avatar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.regdNo || user?.email}</p>
            </div>
            <button
              onClick={onProfileClick}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity ${
                houseColors ? houseColors.bg : 'bg-blue-600'
              }`}
              title="Open profile"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={() => { setMobileOpen(false); onProfileClick?.(); }}
              className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              My Profile
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
