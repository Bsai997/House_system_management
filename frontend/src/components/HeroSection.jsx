import { getHouseColor, getHouseLogo } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { HiBell } from 'react-icons/hi';

const HeroSection = ({ title, subtitle }) => {
  const { user } = useAuth();
  const houseName = user?.house?.name;
  const houseColors = houseName ? getHouseColor(houseName) : null;

  return (
    <div
      className={`bg-gradient-to-r ${
        houseColors ? houseColors.gradient : 'from-blue-600 to-indigo-700'
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {houseName && (
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                {getHouseLogo(houseName)}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {title || (houseName ? `House ${houseName}` : 'House Management')}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {subtitle || `Welcome back, ${user?.name}`}
              </p>
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
  );
};

export default HeroSection;
