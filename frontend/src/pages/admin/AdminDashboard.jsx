import { useEffect, useState } from 'react';
import { getGlobalDashboard } from '../../services/api';
import LeaderboardCard from '../../components/LeaderboardCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { getHouseColor } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getGlobalDashboard();
        setData(res.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{data?.stats?.totalHouses}</p>
          <p className="text-sm text-gray-500 mt-1">Total Houses</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{data?.stats?.totalStudents}</p>
          <p className="text-sm text-gray-500 mt-1">Total Students</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-purple-600">{data?.stats?.totalEvents}</p>
          <p className="text-sm text-gray-500 mt-1">Total Events</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-amber-600">{data?.stats?.publishedEvents}</p>
          <p className="text-sm text-gray-500 mt-1">Published Events</p>
        </div>
      </div>

      {/* House Overview Cards */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">🏛️ House Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {data?.dashboard?.map((house) => {
          const colors = getHouseColor(house.name);
          return (
            <div key={house._id} className="card p-5 text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: colors.light }}
              >
                {house.logo || '🏠'}
              </div>
              <h3 className="font-bold text-gray-900">House {house.name}</h3>
              <p className="text-2xl font-bold mt-2" style={{ color: colors.primary }}>
                {house.totalPoints}
              </p>
              <p className="text-xs text-gray-400">points</p>
              <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
                <span>#{house.rank} rank</span>
                <span>{house.eventsCount || 0} events</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Leaderboard */}
      {data?.dashboard && <LeaderboardCard houses={data.dashboard} />}
    </div>
  );
};

export default AdminDashboard;
