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
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getPublishedEvents();
      setEvents(res.data.events);
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">📢 Ongoing Events</h2>
        <span className="text-sm text-gray-500">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-600">No events available</h3>
          <p className="text-gray-400">Check back later for new events</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${events.length === 1 ? 'grid-cols-1 justify-items-center max-w-lg mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
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
                    className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                      isParticipant
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'btn-primary'
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
      )}
    </div>
  );
};

export default StudentHome;
