import { useEffect, useState } from 'react';
import { getHouseDashboard } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor } from '../../utils/constants';
import toast from 'react-hot-toast';

const TeamLeadHousePoints = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const houseColors = getHouseColor(user?.house?.name);

  useEffect(() => {
    const fetch = async () => {
      try {
        const houseId = user?.house?._id;
        if (houseId) {
          const res = await getHouseDashboard(houseId);
          setDashboard(res.data);
        }
      } catch {
        toast.error('Failed to load house points');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            row.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
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
      {/* House Stats */}
      {dashboard?.house && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: houseColors.primary }}>
              {dashboard.house.totalPoints}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total House Points</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-700">{dashboard.totalStudents}</p>
            <p className="text-sm text-gray-500 mt-1">Total Members</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-700">
              {dashboard.house.eventsCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Events Conducted</p>
          </div>
        </div>
      )}

      {dashboard && (
        <DataTable
          columns={columns}
          data={dashboard.students}
          searchFields={['name', 'regdNo', 'department']}
          title={`House ${user?.house?.name} - Internal Dashboard`}
        />
      )}
    </div>
  );
};

export default TeamLeadHousePoints;
