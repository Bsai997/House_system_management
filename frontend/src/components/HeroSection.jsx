import { getHouseColor, getHouseLogo, isImageLogo } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const HeroSection = ({ title, subtitle, actionButton }) => {
  const { user } = useAuth();
  const houseName = user?.house?.name;
  const houseColors = houseName ? getHouseColor(houseName) : null;
  const isJal = houseName === 'Jal';

  return (
    <div
      className={`text-white relative overflow-hidden ${
        isJal ? '' : `bg-gradient-to-r ${houseColors ? houseColors.gradient : 'from-blue-600 to-indigo-700'}`
      }`}
      style={isJal ? {
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 30%, #0ea5e9 60%, #06b6d4 80%, #0891b2 100%)',
      } : undefined}
    >
      {/* Water shimmer overlay — Jal only */}
      {isJal && (
        <>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'repeating-linear-gradient(100deg, transparent, transparent 8px, rgba(255,255,255,0.08) 8px, rgba(255,255,255,0.08) 16px)',
            }}
          />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.6), transparent 70%)' }}
          />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.5), transparent 70%)' }}
          />
        </>
      )}
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
