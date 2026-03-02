import { useEffect, useState } from 'react';
import { getMyEvents, publishEvent, closeEvent } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const TeamLeadHistory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(null);
  const [closing, setClosing] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents();
      setEvents(res.data.events);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (eventId) => {
    setPublishing(eventId);
    try {
      await publishEvent(eventId);
      toast.success('Event published successfully!');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally {
      setPublishing(null);
    }
  };

  const handleClose = async (eventId) => {
    setClosing(eventId);
    try {
      await closeEvent(eventId);
      toast.success('Event marked as completed!');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close event');
    } finally {
      setClosing(null);
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Event History</h2>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-600">No events created yet</h3>
          <p className="text-gray-400">Create your first event from the Home page</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={
                <>
                  {event.status === 'approved' && (
                    <button
                      onClick={() => handlePublish(event._id)}
                      disabled={publishing === event._id}
                      className="w-full btn-success"
                    >
                      {publishing === event._id ? 'Publishing...' : '🚀 Publish Event'}
                    </button>
                  )}
                  {event.status === 'published' && (
                    <button
                      onClick={() => handleClose(event._id)}
                      disabled={closing === event._id}
                      className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition"
                    >
                      {closing === event._id ? 'Completing...' : '✅ Mark as Completed'}
                    </button>
                  )}
                  {event.status === 'closed' && (
                    <div className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-xl font-medium text-center text-sm">
                      ✅ Event Completed
                    </div>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamLeadHistory;
