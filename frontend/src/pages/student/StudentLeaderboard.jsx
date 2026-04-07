import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../services/api';
import LeaderboardCard from '../../components/LeaderboardCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const StudentLeaderboard = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLeaderboard();
        setHouses(res.data.leaderboard);
      } catch {
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">🏆 Global Leaderboard</h2>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl">
          <LeaderboardCard houses={houses} />
        </div>
      </div>
    </div>
  );
};

export default StudentLeaderboard;
