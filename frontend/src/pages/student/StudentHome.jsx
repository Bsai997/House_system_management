import { useEffect, useState } from 'react';
import { getPublishedEvents, registerForEvent } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentHome = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    try {
      const res = await getPublishedEvents(page);
      setEvents(res.data.events);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      await registerForEvent(eventId);
      toast.success('Successfully registered for the event!');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div className="dashboard-content">
      <div className="flex items-center justify-between mb-8">
        <h2 className="section-title">📢 Ongoing Events</h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">📭</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events available</h3>
          <p className="text-gray-500">Check back later for new events</p>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${events.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {events.map((event) => {
              const isParticipant = event.participants?.includes(user?.id);
              return (
                <EventCard
                  key={event._id}
                  event={event}
                  actions={
                    <button
                      onClick={() => handleRegister(event._id)}
                      disabled={registering === event._id || isParticipant}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        isParticipant
                          ? 'bg-green-50 text-green-700 border border-green-100 cursor-default'
                          : 'btn-primary disabled:opacity-50'
                      }`}
                    >
                      {registering === event._id
                        ? 'Registering...'
                        : isParticipant
                        ? '✓ Registered'
                        : 'Register for Event'}
                    </button>
                  }
                />
              );
            })}
          </div>

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

export default StudentHome;
