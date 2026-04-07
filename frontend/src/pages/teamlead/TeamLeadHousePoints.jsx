import { useEffect, useState, useRef } from 'react';
import { getHouseDashboard } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor } from '../../utils/constants';
import toast from 'react-hot-toast';
import { HiUsers, HiStar, HiCalendar } from 'react-icons/hi';

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (value == null) return;
    const start = performance.now();
    const to = Number(value);

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(to * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{display}</>;
}

const TeamLeadHousePoints = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const houseColors = getHouseColor(user?.house?.name);

  useEffect(() => {
    const fetch = async () => {
      try {
        const houseId = user?.house?._id;
        if (houseId) {
          const res = await getHouseDashboard(houseId);
          setDashboard(res.data);
        }
      } catch {
        toast.error('Failed to load house points');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  const statsCards = [
    {
      label: 'Total House Points',
      value: dashboard?.house?.totalPoints || 0,
      icon: <HiStar className="w-6 h-6" />,
      gradient: houseColors.gradient || 'from-amber-400 to-orange-500',
      bgLight: houseColors.bgLight || 'bg-amber-50',
      textColor: houseColors.text || 'text-amber-600',
    },
    {
      label: 'Total Members',
      value: dashboard?.totalStudents || 0,
      icon: <HiUsers className="w-6 h-6" />,
      gradient: 'from-blue-400 to-indigo-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Events Conducted',
      value: dashboard?.house?.eventsCount || 0,
      icon: <HiCalendar className="w-6 h-6" />,
      gradient: 'from-emerald-400 to-green-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

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

  return (
    <div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
        }
      `}</style>

      {/* House Stats */}
      {dashboard?.house && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statsCards.map((stat, i) => (
            <div
              key={i}
              className="fade-up group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${stat.bgLight} ${stat.textColor} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900"><AnimatedCounter value={stat.value} /></p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              <div className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      )}

      {dashboard && (
        <div className="fade-up" style={{ animationDelay: '500ms' }}>
        <DataTable
          columns={columns}
          data={dashboard.students}
          searchFields={['name', 'regdNo', 'department']}
          title={`House ${user?.house?.name} - Internal Dashboard`}
        />
        </div>
      )}
    </div>
  );
};

export default TeamLeadHousePoints;
