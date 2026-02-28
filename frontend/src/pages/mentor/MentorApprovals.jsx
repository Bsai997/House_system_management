import { useEffect, useState } from 'react';
import { getPendingEvents, approveEvent } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const MentorApprovals = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await getPendingEvents();
      setEvents(res.data.events);
    } catch {
      toast.error('Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId, status) => {
    setProcessing(eventId);
    try {
      await approveEvent(eventId, status);
      toast.success(status === 'approved' ? 'Event approved!' : 'Event rejected.');
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={3} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Team Lead</p>
          <h2 className="text-xl font-bold text-gray-900">📋 Approval Requests</h2>
        </div>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
          {events.length} pending
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">✅</p>
          <h3 className="text-lg font-semibold text-gray-600">All caught up!</h3>
          <p className="text-gray-400">No pending approval requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={
                <>
                  <button
                    onClick={() => handleApprove(event._id, 'approved')}
                    disabled={processing === event._id}
                    className="flex-1 btn-success text-sm"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleApprove(event._id, 'rejected')}
                    disabled={processing === event._id}
                    className="flex-1 btn-danger text-sm"
                  >
                    ✗ Reject
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorApprovals;
