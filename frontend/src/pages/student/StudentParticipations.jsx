import { useEffect, useState } from 'react';
import { getMyParticipations } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { formatDate } from '../../utils/constants';
import toast from 'react-hot-toast';

const StudentParticipations = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyParticipations();
        setParticipations(res.data.participations);
      } catch {
        toast.error('Failed to load participations');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  const columns = [
    { key: 'eventName', label: 'Event Name', sortable: true, render: (row) => row.eventId?.name },
    { key: 'date', label: 'Date', sortable: true, render: (row) => formatDate(row.eventId?.date) },
    {
      key: 'house',
      label: 'Conducted By',
      render: (row) => (
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: row.eventId?.houseId?.color }}
          />
          House {row.eventId?.houseId?.name}
        </span>
      ),
    },
    {
      key: 'pointsAwarded',
      label: 'Points Gained',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
          🏆 +{row.pointsAwarded}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">🎫 My Event Participations</h2>

      {participations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎪</p>
          <h3 className="text-lg font-semibold text-gray-600">No participations yet</h3>
          <p className="text-gray-400">Register and attend events to see them here</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={participations}
          searchFields={['eventId.name', 'eventId.houseId.name']}
          title={`${participations.length} Events Participated`}
        />
      )}
    </div>
  );
};

export default StudentParticipations;
