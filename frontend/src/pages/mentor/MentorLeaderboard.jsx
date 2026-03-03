import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../services/api';
import LeaderboardCard from '../../components/LeaderboardCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const MentorLeaderboard = () => {
  const [houses, setHouses] = useState(null);
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
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">🏆 Global House Leaderboard</h2>
      <div className="flex justify-center w-full">
        {houses && (
          <div className="w-full max-w-4xl">
            <LeaderboardCard houses={houses} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorLeaderboard;
