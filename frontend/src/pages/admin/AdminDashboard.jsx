import { useEffect, useState } from 'react';
import { getGlobalDashboard } from '../../services/api';
import LeaderboardCard from '../../components/LeaderboardCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
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
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-3 gap-5 max-w-2xl w-full">
          <div className="card py-6 px-4 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <p className="text-4xl font-bold text-green-600">{data?.stats?.totalStudents}</p>
            <p className="text-sm text-gray-500 mt-2">Total Students</p>
          </div>
          <div className="card py-6 px-4 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <p className="text-4xl font-bold text-blue-600">{data?.stats?.ongoingEvents}</p>
            <p className="text-sm text-gray-500 mt-2">Ongoing Events</p>
          </div>
          <div className="card py-6 px-4 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <p className="text-4xl font-bold text-amber-600">{data?.stats?.completedEvents}</p>
            <p className="text-sm text-gray-500 mt-2">Completed Events</p>
          </div>
        </div>
      </div>

      {/* Global Leaderboard */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">🏆 Global House Leaderboard</h2>
      <div className="flex justify-center w-full">
        {data?.dashboard && <div className="w-full max-w-4xl"><LeaderboardCard houses={data.dashboard} /></div>}
      </div>

    </div>
  );
};

export default AdminDashboard;
