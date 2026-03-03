import { useEffect, useRef, useState } from 'react';
import { getHouseColor, isImageLogo } from '../utils/constants';

const LeaderboardCard = ({ houses }) => {
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef(null);
  const medals = ['🥇', '🥈', '🥉'];

  const maxPoints = Math.max(...houses.map((h) => h.totalPoints), 1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
        }
        if (!entry.isIntersecting && animated) {
          setAnimated(false);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={containerRef} className="space-y-4">
      {houses.map((house, index) => {
        const colors = getHouseColor(house.name);
        const barWidth = animated
          ? Math.max((house.totalPoints / maxPoints) * 100, 5)
          : 0;

        return (
          <div
            key={house._id}
            className="card flex items-center gap-4 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
          >
            {/* Rank Medal */}
            <div className="text-2xl w-8 text-center shrink-0">
              {index < 3 ? medals[index] : <span className="text-sm font-bold text-gray-400">#{index + 1}</span>}
            </div>

            {/* House Logo */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})` }}
            >
              {isImageLogo(house.name) ? (
                <img src={`/${house.name.toLowerCase()}-logo.png`} alt={house.name} className="w-full h-full object-cover" />
              ) : (
                <span className="drop-shadow-md">{house.logo || '🏠'}</span>
              )}
            </div>

            {/* Name, Stats & Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-bold text-gray-900 text-base">{house.name}</h4>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {house.eventsCount || 0} events · {house.studentsCount ?? 0} students
              </p>
              {/* Horizontal Bar */}
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.dark})`,
                  }}
                />
              </div>
            </div>

            {/* Points */}
            <div className="text-right shrink-0 pl-4">
              <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                {house.totalPoints}
              </p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardCard;
