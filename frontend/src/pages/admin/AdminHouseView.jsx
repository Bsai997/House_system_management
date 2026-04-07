import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllHouses, getAdminHouseDashboard, getAdminHouseEvents } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EventCard from '../../components/EventCard';
import { getHouseColor, getHouseLogo, isImageLogo } from '../../utils/constants';
import toast from 'react-hot-toast';
import { useState as useLocalState, useMemo } from 'react';
import { HiSearch } from 'react-icons/hi';

/* ─── Animated Number ─── */
function AnimNum({ val }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!val) return;
    let start = performance.now();
    const to = Number(val);
    const go = (now) => {
      const p = Math.min((now - start) / 1000, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [val]);
  return <>{n}</>;
}

/* ─── House Stat Mini Card ─── */
function MiniStat({ icon, label, value, color }) {
  return (
    <div className="flex-1 min-w-[calc(50%-6px)] sm:min-w-0 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white/95 backdrop-blur-sm border border-purple-100/60 shadow-lg shadow-purple-200/40 hover:shadow-xl hover:shadow-purple-300/50 hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden">
      <div className="absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full opacity-50" style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }} />
      <div className="text-xl mb-2">{icon}</div>
      <div className="text-2xl font-extrabold leading-none mb-1 tabular-nums" style={{ color }}><AnimNum val={value} /></div>
      <p className="text-gray-500 text-xs m-0 font-medium">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />
    </div>
  );
}

/* ─── Student Table ─── */
function StudentTable({ students, houseColors }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');

  const cols = [
    { key: 'rank', label: 'Rank', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'regdNo', label: 'Regd No', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'department', label: 'Department', sortable: false },
    { key: 'totalPoints', label: 'Points', sortable: true },
  ];

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(s =>
      ['name', 'regdNo', 'department'].some(f =>
        String(s[f] ?? '').toLowerCase().includes(q)
      )
    );
  }, [students, search]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av ?? '').localeCompare(String(bv ?? ''))
        : String(bv ?? '').localeCompare(String(av ?? ''));
    });
  }, [filtered, sortField, sortDir]);

  const handleSort = (key) => {
    if (sortField === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(key); setSortDir('asc'); }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-100/60 shadow-xl shadow-purple-200/40 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-wrap bg-white/50">
        <div>
          <h3 className="font-bold text-gray-900 text-base m-0 mb-0.5">🎓 Student Members</h3>
          <p className="text-gray-500 text-xs m-0">{sorted.length} of {students.length} members</p>
        </div>
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full sm:w-56 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-3 sm:px-5 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors select-none border-b border-gray-100 ${col.sortable ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ color: sortField === col.key ? houseColors.primary : undefined }}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortField === col.key && <span style={{ color: houseColors.primary }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="py-12 px-5 text-center text-gray-500 text-sm">
                  <div className="text-4xl mb-2">🔍</div>No students found
                </td>
              </tr>
            ) : sorted.map((row, idx) => (
              <tr key={row._id || idx} className="border-b border-gray-50 hover:bg-purple-50/50 transition-colors">
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${row.rank <= 3 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-100 text-gray-500'}`}>
                    {row.rank <= 3 ? ['1', '2', '3'][row.rank - 1] : row.rank}
                  </div>
                </td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-gray-900">{row.name}</td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm text-gray-500 font-mono">{row.regdNo}</td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold" style={{ background: `${houseColors.primary}20`, color: houseColors.primary }}> {row.year}</span>
                </td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm text-gray-500">{row.department}</td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                  <span className="text-sm sm:text-base font-extrabold tabular-nums" style={{ color: houseColors.primary }}>{row.totalPoints}</span>
                  <span className="text-gray-400 text-xs ml-1">pts</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Admin House View ─── */
const AdminHouseView = () => {
  const { houseName } = useParams();
  const [house, setHouse] = useState(null);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const [loading, setLoading] = useState(true);

  const houseNameCap = houseName?.charAt(0).toUpperCase() + houseName?.slice(1);
  const houseColors = getHouseColor(houseNameCap);

  useEffect(() => {
    setShowEvents(false);
    setLoading(true);
    const fetch = async () => {
      try {
        const housesRes = await getAllHouses();
        const found = housesRes.data.houses.find(h => h.name.toLowerCase() === houseName?.toLowerCase());
        if (found) {
          const [dashRes, eventsRes] = await Promise.all([
            getAdminHouseDashboard(found._id),
            getAdminHouseEvents(found._id),
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

  if (loading) return <div style={{ padding: '20px' }}><LoadingSkeleton type="table" count={5} /></div>;

  if (!house) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">❓</div>
      <h3 className="text-gray-500 text-lg font-semibold">House not found</h3>
    </div>
  );

  // ── Events view ──
  if (showEvents) return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .5s ease forwards;opacity:0}`}</style>

      {/* Back button */}
      <button
        onClick={() => setShowEvents(false)}
        className="inline-flex items-center gap-2 mb-7 px-5 py-2 bg-white/80 hover:bg-white text-purple-700 rounded-full font-semibold text-sm border border-purple-100 shadow-md transition-all duration-300 hover:scale-105"
      >
        ← Back to House {houseNameCap}
      </button>

      {/* Events header */}
      <div className="fu flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-2xl shrink-0" style={{ background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`, boxShadow: `0 4px 20px ${houseColors.primary}50` }}>
          {isImageLogo(houseNameCap) ? <img src={getHouseLogo(houseNameCap)} alt={houseNameCap} className="w-full h-full object-cover" /> : getHouseLogo(houseNameCap)}
        </div>
        <div>
          <h2 className="text-gray-900 text-xl font-extrabold m-0 mb-0.5">House {houseNameCap} · Events</h2>
          <p className="text-gray-500 text-sm m-0 font-medium">{(events?.all?.length || 0)} total events</p>
        </div>
      </div>

      {/* Ongoing */}
      {events?.ongoing?.length > 0 && (
        <div className="fu mb-9" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <h3 className="text-gray-900 text-base font-bold m-0">Ongoing Events <span className="text-gray-400 font-normal">({events.ongoing.length})</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.ongoing.map(ev => <EventCard key={ev._id} event={ev} variant="purple" />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {events?.previous?.length > 0 && (
        <div className="fu" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg">✅</span>
            <h3 className="text-gray-900 text-base font-bold m-0">Completed Events <span className="text-gray-400 font-normal">({events.previous.length})</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.previous.map(ev => <EventCard key={ev._id} event={ev} variant="purple" />)}
          </div>
        </div>
      )}

      {events?.ongoing?.length === 0 && events?.previous?.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 text-base font-semibold">No events found for this house</p>
        </div>
      )}
    </div>
  );

  // ── Main house view ──
  return (
    <div>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .55s ease forwards;opacity:0}
        @keyframes houseGlow{0%,100%{opacity:.6}50%{opacity:1}}
      `}</style>

      {/* House hero banner */}
      <div
        className="fu rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-7 relative overflow-hidden bg-white/95 backdrop-blur-sm border border-purple-100/60 shadow-xl"
        style={{ borderColor: `${houseColors.primary}30`, boxShadow: `0 20px 40px -12px ${houseColors.primary}20` }}
      >
        <div className="absolute -top-1/2 -right-[10%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${houseColors.primary}40, transparent 70%)` }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <div className="flex items-center gap-4 sm:flex-1">
          <div
            className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center text-2xl sm:text-3xl overflow-hidden shrink-0"
            style={{ background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`, boxShadow: `0 8px 30px ${houseColors.primary}50` }}
          >
            {isImageLogo(houseNameCap) ? <img src={getHouseLogo(houseNameCap)} alt={houseNameCap} className="w-full h-full object-cover" /> : getHouseLogo(houseNameCap)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 m-0">House {houseNameCap}</h1>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shrink-0" style={{ background: `${houseColors.primary}25`, color: houseColors.primary, border: `1px solid ${houseColors.primary}40` }}>ACTIVE</span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm m-0 font-medium truncate sm:whitespace-normal">
              Mentor: <span className="text-gray-700">{house.mentorId?.name || 'N/A'}</span>
              {' · '} Team Lead: <span className="text-gray-700">{house.teamLeadId?.name || 'N/A'}</span>
            </p>
          </div>
          </div>
          <div className="text-left sm:text-right shrink-0 border-t border-purple-100/40 pt-4 sm:border-0 sm:pt-0">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black leading-none tabular-nums" style={{ background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {house.totalPoints || 0}
            </div>
            <p className="text-gray-500 text-xs mt-1 font-semibold uppercase tracking-wider">Total Points</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="fu flex gap-3 sm:gap-4 mb-5 sm:mb-7 flex-wrap" style={{ animationDelay: '100ms' }}>
        <MiniStat icon="🎓" label="Students" value={students.length} color={houseColors.primary} />
        <MiniStat icon="📅" label="Total Events" value={events?.all?.length || 0} color="#F59E0B" />
        <MiniStat icon="🔥" label="Ongoing Events" value={events?.ongoing?.length || 0} color="#22C55E" />
        <MiniStat icon="✅" label="Completed" value={events?.previous?.length || 0} color="#6366F1" />
      </div>

      {/* View Events button */}
      <div className="fu mb-7" style={{ animationDelay: '200ms' }}>
        <button
          onClick={() => setShowEvents(true)}
          className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto justify-center"
          style={{ background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})` }}
        >
          <span className="text-lg">📅</span>
          <span>View All Events</span>
          <span className="opacity-80">→</span>
        </button>
      </div>

      {/* Students table */}
      <div className="fu" style={{ animationDelay: '300ms' }}>
        <StudentTable students={students} houseColors={houseColors} />
      </div>
    </div>
  );
};

export default AdminHouseView;
