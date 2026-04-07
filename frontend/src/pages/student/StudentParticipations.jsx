import { useEffect, useState } from 'react';
import { getMyParticipations } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { formatDate } from '../../utils/constants';
import toast from 'react-hot-toast';

const StudentParticipations = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyParticipations(page);
        setParticipations(res.data.participations);
        setPagination(res.data.pagination);
      } catch {
        toast.error('Failed to load participations');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

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
        <>
          <DataTable
            columns={columns}
            data={participations}
            searchFields={['eventId.name', 'eventId.houseId.name']}
            title={`${pagination?.total || participations.length} Events Participated`}
          />

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentParticipations;
