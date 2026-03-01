import { useEffect, useState } from 'react';
import { getPendingEvents, approveEvent } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor, getHouseLogo } from '../../utils/constants';
import toast from 'react-hot-toast';
import { HiCheck, HiX, HiClock, HiClipboardList, HiShieldCheck, HiFilter } from 'react-icons/hi';

const MentorApprovals = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const houseName = user?.house?.name;
  const houseColors = houseName ? getHouseColor(houseName) : null;

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
      if (status === 'approved') setApprovedCount((c) => c + 1);
      else setRejectedCount((c) => c + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={3} />;

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => {
        if (filter === 'today') {
          return new Date(e.date).toDateString() === new Date().toDateString();
        }
        return true;
      });

  const stats = [
    {
      label: 'Pending Review',
      value: events.length,
      icon: <HiClock className="w-6 h-6" />,
      color: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Approved Today',
      value: approvedCount,
      icon: <HiCheck className="w-6 h-6" />,
      color: 'from-emerald-400 to-green-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Rejected Today',
      value: rejectedCount,
      icon: <HiX className="w-6 h-6" />,
      color: 'from-rose-400 to-red-500',
      bgLight: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
    {
      label: 'Your Role',
      value: 'Mentor',
      icon: <HiShieldCheck className="w-6 h-6" />,
      color: houseColors ? houseColors.gradient : 'from-blue-400 to-indigo-500',
      bgLight: houseColors ? houseColors.bgLight : 'bg-blue-50',
      textColor: houseColors ? houseColors.text : 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{houseName ? getHouseLogo(houseName) : '📋'}</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  You have <span className="text-amber-400 font-semibold">{events.length} events</span> waiting for your review
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
            <HiClipboardList className="text-gray-400 w-5 h-5" />
            <span className="text-gray-300 text-sm font-medium">Approval Queue</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.bgLight} ${stat.textColor} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            <div className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        ))}
      </div>

      {/* Events Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
              <p className="text-sm text-gray-500">Review and manage event submissions</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {['all', 'today'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : 'Today'}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 text-center py-16 px-6">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center">
                <HiCheck className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">All caught up!</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                There are no pending approval requests right now. New submissions will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                actions={
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleApprove(event._id, 'approved')}
                      disabled={processing === event._id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5
                                 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold
                                 rounded-xl hover:from-emerald-600 hover:to-green-600
                                 shadow-sm hover:shadow-md transition-all duration-200
                                 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <HiCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApprove(event._id, 'rejected')}
                      disabled={processing === event._id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5
                                 bg-white text-red-600 text-sm font-semibold border border-red-200
                                 rounded-xl hover:bg-red-50
                                 shadow-sm hover:shadow-md transition-all duration-200
                                 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <HiX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorApprovals;
