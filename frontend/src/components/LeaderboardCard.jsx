import { getHouseColor } from '../utils/constants';

const LeaderboardCard = ({ houses }) => {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="card">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">🏆 Global House Leaderboard</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {houses.map((house, index) => {
          const colors = getHouseColor(house.name);
          return (
            <div
              key={house._id}
              className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl w-8 text-center">
                  {index < 3 ? medals[index] : `#${index + 1}`}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}
                  style={{ backgroundColor: colors.light }}
                >
                  {house.logo || '🏠'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">House {house.name}</h4>
                  <p className="text-sm text-gray-500">
                    {house.eventsCount || 0} events conducted
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {house.totalPoints}
                </p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardCard;
