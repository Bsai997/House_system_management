import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllHouses, getAdminHouseDashboard, getAdminHouseEvents } from '../../services/api';
import DataTable from '../../components/DataTable';
import EventCard from '../../components/EventCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { getHouseColor, getHouseLogo, formatDate } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminHouseView = () => {
  const { houseName } = useParams();
  const [house, setHouse] = useState(null);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const [loading, setLoading] = useState(true);

  const houseNameCapitalized = houseName?.charAt(0).toUpperCase() + houseName?.slice(1);
  const houseColors = getHouseColor(houseNameCapitalized);

  useEffect(() => {
    setShowEvents(false);
    setLoading(true);
    const fetch = async () => {
      try {
        const housesRes = await getAllHouses();
        const foundHouse = housesRes.data.houses.find(
          (h) => h.name.toLowerCase() === houseName?.toLowerCase()
        );

        if (foundHouse) {
          const [dashRes, eventsRes] = await Promise.all([
            getAdminHouseDashboard(foundHouse._id),
            getAdminHouseEvents(foundHouse._id),
          ]);
          setHouse(dashRes.data.house);
          setStudents(dashRes.data.students);
          setEvents(eventsRes.data);
        }
      } catch {
        toast.error('Failed to load house data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [houseName]);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  if (!house) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">❓</p>
        <h3 className="text-lg font-semibold text-gray-600">House not found</h3>
      </div>
    );
  }

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

  if (showEvents) {
    return (
      <div>
        <button
          onClick={() => setShowEvents(false)}
          className="mb-6 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to House {houseNameCapitalized}
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {getHouseLogo(houseNameCapitalized)} House {houseNameCapitalized} - Events
        </h2>

        {/* Ongoing Events */}
        {events?.ongoing?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🟢 Ongoing Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.ongoing.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Previous Events */}
        {events?.previous?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📜 Previous Events</h3>
            <div className="space-y-3">
              {events.previous.map((event) => (
                <div key={event._id} className="card p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.name}</h4>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span>📍 {event.venue}</span>
                      <span>📅 {formatDate(event.date)}</span>
                      <span>🏆 {event.housePoints} pts</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {event.participationCount || 0} participants
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {events?.ongoing?.length === 0 && events?.previous?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>No events found for this house</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* House Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{getHouseLogo(houseNameCapitalized)}</span>
        <h2 className="text-xl font-bold text-gray-900">House {houseNameCapitalized}</h2>
      </div>

      {/* Top Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">House Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Mentor</span>
              <span className="font-semibold">{house.mentorId?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Team Lead</span>
              <span className="font-semibold">{house.teamLeadId?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Points</span>
              <span className="font-bold text-xl" style={{ color: houseColors.primary }}>
                {house.totalPoints || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex flex-col items-center justify-center">
          <p className="text-4xl mb-3">📅</p>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {events?.all?.length || 0} Events
          </h3>
          <button
            onClick={() => setShowEvents(true)}
            className="btn-primary"
            style={{ backgroundColor: houseColors.primary }}
          >
            View Events →
          </button>
        </div>
      </div>

      {/* Students Table */}
      <DataTable
        columns={columns}
        data={students}
        searchFields={['name', 'regdNo', 'department']}
        title={`House ${houseNameCapitalized} - Internal Dashboard`}
      />
    </div>
  );
};

export default AdminHouseView;
