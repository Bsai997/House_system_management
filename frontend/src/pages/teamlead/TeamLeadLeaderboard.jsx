import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../services/api';
import LeaderboardCard from '../../components/LeaderboardCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const TeamLeadLeaderboard = () => {
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
      <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Global Leaderboard</h2>
      <LeaderboardCard houses={houses} />
    </div>
  );
};

export default TeamLeadLeaderboard;
