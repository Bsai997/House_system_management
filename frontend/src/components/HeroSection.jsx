import { getHouseColor, getHouseLogo, isImageLogo } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const HeroSection = ({ title, subtitle, actionButton }) => {
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
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl overflow-hidden">
                {isImageLogo(houseName) ? (
                  <img src={getHouseLogo(houseName)} alt={houseName} className="w-full h-full object-cover" />
                ) : (
                  getHouseLogo(houseName)
                )}
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
          {actionButton && (
            <div className="flex items-center shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
