import { useEffect, useState } from 'react';
import { getHouseDashboard, getMentorHouseEvents } from '../../services/api';
import DataTable from '../../components/DataTable';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor, getHouseLogo, formatDate } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  HiUsers, HiStar, HiTrendingUp, HiCalendar,
  HiArrowLeft, HiChevronRight, HiClock, HiLocationMarker
} from 'react-icons/hi';

const MentorAboutHouse = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const houseName = user?.house?.name;
  const houseColors = getHouseColor(houseName);

  useEffect(() => {
    const fetch = async () => {
      try {
        const houseId = user?.house?._id;
        if (houseId) {
          const [dashRes, eventsRes] = await Promise.all([
            getHouseDashboard(houseId),
            getMentorHouseEvents(),
          ]);
          setDashboard(dashRes.data);
          setEvents(eventsRes.data.events);
        }
      } catch {
        toast.error('Failed to load house data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  const ongoing = events.filter(
    (e) => e.status === 'published' && new Date(e.date) >= new Date()
  );
  const previous = events.filter(
    (e) => e.status === 'published' && new Date(e.date) < new Date()
  );

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (row) => {
        const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
        return (
          <div className="flex items-center gap-2">
            {row.rank <= 3 ? (
              <span className="text-lg">{medals[row.rank]}</span>
            ) : (
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                {row.rank}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: houseColors.primary }}
          >
            {row.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">{row.regdNo}</p>
          </div>
        </div>
      ),
    },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'department', label: 'Dept' },
    {
      key: 'totalPoints',
      label: 'Points',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[80px] h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((row.totalPoints / (dashboard?.students?.[0]?.totalPoints || 1)) * 100, 100)}%`,
                backgroundColor: houseColors.primary,
              }}
            />
          </div>
          <span className="font-bold text-sm" style={{ color: houseColors.primary }}>
            {row.totalPoints}
          </span>
        </div>
      ),
    },
  ];

  // ── Events View ──
  if (showEvents) {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setShowEvents(false)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to House Overview
        </button>

        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b" style={{ backgroundImage: `linear-gradient(to bottom, ${houseColors.primary}, ${houseColors.dark})` }} />
          <h2 className="text-xl font-bold text-gray-900">House Events</h2>
        </div>

        {/* Ongoing Events */}
        {ongoing.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h3 className="text-base font-semibold text-gray-800">Ongoing Events</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{ongoing.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoing.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Previous Events */}
        {previous.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HiClock className="w-4 h-4 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-800">Past Events</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{previous.length}</span>
            </div>
            <div className="space-y-3">
              {previous.map((event) => (
                <div
                  key={event._id}
                  className="group relative bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                        style={{ backgroundColor: houseColors.primary + '15', color: houseColors.primary }}
                      >
                        {event.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.name}</h4>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <HiLocationMarker className="w-3.5 h-3.5" /> {event.venue}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <HiCalendar className="w-3.5 h-3.5" /> {formatDate(event.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: houseColors.primary }}>
                        +{event.housePoints} pts
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {event.participationCount || 0} joined
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongoing.length === 0 && previous.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
              <HiCalendar className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No events yet</h3>
            <p className="text-gray-400 text-sm">Events conducted by or for your house will appear here</p>
          </div>
        )}
      </div>
    );
  }

  // ── Main House Overview ──
  const statsCards = [
    {
      label: 'Total Points',
      value: dashboard?.house?.totalPoints || 0,
      icon: <HiStar className="w-6 h-6" />,
      gradient: `from-amber-400 to-yellow-500`,
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Total Students',
      value: dashboard?.students?.length || 0,
      icon: <HiUsers className="w-6 h-6" />,
      gradient: houseColors.gradient,
      bgLight: houseColors.bgLight,
      textColor: houseColors.text,
    },
    {
      label: 'Total Events',
      value: events.length,
      icon: <HiCalendar className="w-6 h-6" />,
      gradient: 'from-blue-400 to-indigo-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active Events',
      value: ongoing.length,
      icon: <HiTrendingUp className="w-6 h-6" />,
      gradient: 'from-emerald-400 to-green-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
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
            <div className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        ))}
      </div>

      {/* House Info + Events Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* House Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: houseColors.primary }} />
            <h3 className="text-base font-bold text-gray-900">House Information</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-5 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: houseColors.primary + '15' }}
              >
                {getHouseLogo(houseName)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">House {houseName}</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-bold text-lg" style={{ color: houseColors.primary }}>
                    {dashboard?.house?.totalPoints || 0}
                  </span>
                  {' '}total points earned
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Mentor</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: houseColors.primary }}
                  >
                    {(dashboard?.house?.mentorId?.name || user?.name)?.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-gray-900">{dashboard?.house?.mentorId?.name || user?.name}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Team Lead</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: houseColors.primary }}
                  >
                    {(dashboard?.house?.teamLeadId?.name || 'N')?.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-gray-900">{dashboard?.house?.teamLeadId?.name || 'Not Assigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Quick Access */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
            <h3 className="text-base font-bold text-gray-900">Events</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4">
              <HiCalendar className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-bold text-gray-900 text-lg">{events.length}</span> total events
            </p>
            <p className="text-xs text-gray-400 mb-5">
              {ongoing.length} ongoing · {previous.length} completed
            </p>
            <button
              onClick={() => setShowEvents(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              style={{ backgroundColor: houseColors.primary }}
            >
              View All Events
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Rankings Table */}
      {dashboard && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 rounded-full" style={{ backgroundImage: `linear-gradient(to bottom, ${houseColors.primary}, ${houseColors.dark})` }} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Student Rankings</h2>
              <p className="text-sm text-gray-500">Performance leaderboard for House {houseName}</p>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={dashboard.students}
            searchFields={['name', 'regdNo', 'department']}
          />
        </div>
      )}
    </div>
  );
};

export default MentorAboutHouse;
