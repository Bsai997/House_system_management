import { useEffect, useState } from 'react';
import { getMyEvents, getEventRegistrations, markAttendance } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiSearch } from 'react-icons/hi';

const TeamLeadRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [marking, setMarking] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyEvents();
        const publishedEvents = res.data.events.filter((e) => e.status === 'published');
        setEvents(publishedEvents);
      } catch {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fetchRegistrations = async (eventId) => {
    setRegLoading(true);
    setSelectedEvent(eventId);
    try {
      const res = await getEventRegistrations(eventId);
      setRegistrations(res.data.registrations);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setRegLoading(false);
    }
  };

  const handleMark = async (participationId, status) => {
    setMarking(participationId);
    try {
      await markAttendance(participationId, status);
      toast.success(
        status === 'present' ? 'Marked present! Points awarded.' : 'Marked absent.'
      );
      // Remove from list after marking
      setRegistrations((prev) => prev.filter((r) => r._id !== participationId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(null);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const query = search.toLowerCase();
    return (
      r.studentId?.name?.toLowerCase().includes(query) ||
      r.studentId?.regdNo?.toLowerCase().includes(query)
    );
  });

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Student Registrations</h2>

      {/* Event Selector */}
      <div className="card p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Event
        </label>
        <select
          onChange={(e) => e.target.value && fetchRegistrations(e.target.value)}
          className="input-field"
          value={selectedEvent || ''}
        >
          <option value="">Choose an event...</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Registrations Table */}
      {selectedEvent && (
        <div className="card">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              Registered Students ({filteredRegistrations.length})
            </h3>
            <div className="relative w-full sm:w-72">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or regd no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {regLoading ? (
            <LoadingSkeleton type="table" count={3} />
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p>No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header px-6 py-3">Name</th>
                    <th className="table-header px-6 py-3">Regd No</th>
                    <th className="table-header px-6 py-3">Year</th>
                    <th className="table-header px-6 py-3">Department</th>
                    <th className="table-header px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {reg.studentId?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reg.studentId?.regdNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Year {reg.studentId?.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reg.studentId?.department}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMark(reg._id, 'present')}
                            disabled={marking === reg._id}
                            className="btn-success text-xs px-3 py-1.5"
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() => handleMark(reg._id, 'absent')}
                            disabled={marking === reg._id}
                            className="btn-danger text-xs px-3 py-1.5"
                          >
                            ✗ Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamLeadRegistrations;
