import { useEffect, useState } from 'react';
import { getHouseDashboard, getMyRank } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor } from '../../utils/constants';
import toast from 'react-hot-toast';

const StudentHouseboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [rankInfo, setRankInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const houseId = user?.house?._id;
        if (houseId) {
          const [dashRes, rankRes] = await Promise.all([
            getHouseDashboard(houseId),
            getMyRank(),
          ]);
          setDashboard(dashRes.data);
          setRankInfo(rankRes.data);
        }
      } catch {
        toast.error('Failed to load house dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  const houseColors = getHouseColor(user?.house?.name);

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            row.rank <= 3
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.rank}
        </span>
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'regdNo', label: 'Regd No', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'department', label: 'Department' },
    {
      key: 'totalPoints',
      label: 'Points',
      sortable: true,
      render: (row) => (
        <span className="font-bold" style={{ color: houseColors.primary }}>
          {row.totalPoints}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Personal Stats */}
      {rankInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: houseColors.primary }}>
              #{rankInfo.rank}
            </p>
            <p className="text-sm text-gray-500 mt-1">Your Rank</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: houseColors.primary }}>
              {rankInfo.totalPoints}
            </p>
            <p className="text-sm text-gray-500 mt-1">Your Points</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-700">
              {rankInfo.totalStudents}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Members</p>
          </div>
        </div>
      )}

      {/* House Ranking Table */}
      {dashboard && (
        <DataTable
          columns={columns}
          data={dashboard.students}
          searchFields={['name', 'regdNo', 'department']}
          title={`House ${user?.house?.name} - Internal Ranking`}
        />
      )}
    </div>
  );
};

export default StudentHouseboard;
