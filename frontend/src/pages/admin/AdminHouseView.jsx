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
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}25`,
      borderRadius: '14px',
      padding: '18px 20px',
      flex: 1,
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s ease', cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3), 0 0 20px ${color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '70px', height: '70px',
        background: `radial-gradient(circle, ${color}25, transparent 70%)`,
        borderRadius: '50%',
      }} />
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontSize: '28px', fontWeight: '800', lineHeight: 1, marginBottom: '4px',
        color: color, fontVariantNumeric: 'tabular-nums',
      }}>
        <AnimNum val={value} />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0, fontWeight: '500' }}>{label}</p>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
      }} />
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
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px',
      overflow: 'hidden',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Table header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div>
          <h3 style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '700', fontSize: '16px', margin: '0 0 2px' }}>
            🎓 Student Members
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>
            {sorted.length} of {students.length} members
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <HiSearch style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.35)', fontSize: '16px',
          }} />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '9px 14px 9px 36px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: 'rgba(255,255,255,0.85)',
              fontSize: '13px', outline: 'none', width: '220px',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = houseColors.primary + '60';
              e.target.style.boxShadow = `0 0 0 3px ${houseColors.primary}15`;
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px', fontWeight: '700',
                    color: sortField === col.key ? houseColors.primary : 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      <span style={{ color: houseColors.primary }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={cols.length} style={{
                  padding: '48px 20px', textAlign: 'center',
                  color: 'rgba(255,255,255,0.25)', fontSize: '14px',
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
                  No students found
                </td>
              </tr>
            ) : sorted.map((row, idx) => (
              <tr
                key={row._id || idx}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Rank */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: row.rank <= 3
                      ? 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.15))'
                      : 'rgba(255,255,255,0.05)',
                    border: row.rank <= 3 ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700',
                    color: row.rank <= 3 ? '#F59E0B' : 'rgba(255,255,255,0.5)',
                  }}>
                    {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
                  </div>
                </td>
                {/* Name */}
                <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '600' }}>
                  {row.name}
                </td>
                {/* Regd */}
                <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontFamily: 'monospace' }}>
                  {row.regdNo}
                </td>
                {/* Year */}
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '50px',
                    background: `${houseColors.primary}18`,
                    color: houseColors.primary,
                    fontSize: '12px', fontWeight: '600',
                  }}>
                    Year {row.year}
                  </span>
                </td>
                {/* Department */}
                <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
                  {row.department}
                </td>
                {/* Points */}
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    fontSize: '16px', fontWeight: '800', color: houseColors.primary,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {row.totalPoints}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginLeft: '3px' }}>pts</span>
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
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>❓</div>
      <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: '600' }}>House not found</h3>
    </div>
  );

  // ── Events view ──
  if (showEvents) return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .5s ease forwards;opacity:0}`}</style>

      {/* Back button */}
      <button
        onClick={() => setShowEvents(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          marginBottom: '28px', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50px', padding: '8px 18px',
          color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      >
        ← Back to House {houseNameCap}
      </button>

      {/* Events header */}
      <div className="fu" style={{
        display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden',
          background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', flexShrink: 0,
          boxShadow: `0 4px 20px ${houseColors.primary}40`,
        }}>
          {isImageLogo(houseNameCap)
            ? <img src={getHouseLogo(houseNameCap)} alt={houseNameCap} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : getHouseLogo(houseNameCap)}
        </div>
        <div>
          <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: '800', margin: '0 0 2px' }}>
            House {houseNameCap} · Events
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: 0, fontWeight: '500' }}>
            {(events?.all?.length || 0)} total events
          </p>
        </div>
      </div>

      {/* Ongoing */}
      {events?.ongoing?.length > 0 && (
        <div className="fu" style={{ marginBottom: '36px', animationDelay: '100ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 8px rgba(34,197,94,0.8)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '700', margin: 0 }}>
              Ongoing Events <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>({events.ongoing.length})</span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {events.ongoing.map(ev => <EventCard key={ev._id} event={ev} />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {events?.previous?.length > 0 && (
        <div className="fu" style={{ animationDelay: '200ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '700', margin: 0 }}>
              Completed Events <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>({events.previous.length})</span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {events.previous.map(ev => <EventCard key={ev._id} event={ev} />)}
          </div>
        </div>
      )}

      {events?.ongoing?.length === 0 && events?.previous?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize: '56px', marginBottom: '14px' }}>📭</div>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>No events found for this house</p>
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
      <div className="fu" style={{
        background: `linear-gradient(135deg, ${houseColors.primary}20, ${houseColors.dark}10)`,
        border: `1px solid ${houseColors.primary}30`,
        borderRadius: '24px', padding: '32px 36px',
        marginBottom: '28px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: '300px', height: '300px',
          background: `radial-gradient(circle, ${houseColors.primary}25, transparent 70%)`,
          borderRadius: '50%', animation: 'houseGlow 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '20%',
          width: '200px', height: '200px',
          background: `radial-gradient(circle, ${houseColors.dark}20, transparent 70%)`,
          borderRadius: '50%',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* House emblem */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', overflow: 'hidden',
            boxShadow: `0 8px 30px ${houseColors.primary}50`,
            border: `2px solid ${houseColors.primary}50`,
          }}>
            {isImageLogo(houseNameCap)
              ? <img src={getHouseLogo(houseNameCap)} alt={houseNameCap} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{getHouseLogo(houseNameCap)}</span>}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{
                fontSize: '28px', fontWeight: '900', margin: 0,
                color: 'rgba(255,255,255,0.95)',
              }}>
                House {houseNameCap}
              </h1>
              <span style={{
                padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: '700',
                background: `${houseColors.primary}25`,
                color: houseColors.primary,
                border: `1px solid ${houseColors.primary}40`,
                letterSpacing: '0.5px',
              }}>ACTIVE</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0, fontWeight: '500' }}>
              Mentor: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{house.mentorId?.name || 'N/A'}</span>
              &nbsp;·&nbsp; Team Lead: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{house.teamLeadId?.name || 'N/A'}</span>
            </p>
          </div>

          {/* Total points big display */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: '48px', fontWeight: '900', lineHeight: 1,
              background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {house.totalPoints || 0}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: '2px 0 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Points
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="fu" style={{
        display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap',
        animationDelay: '100ms',
      }}>
        <MiniStat icon="🎓" label="Students" value={students.length} color={houseColors.primary} />
        <MiniStat icon="📅" label="Total Events" value={events?.all?.length || 0} color="#F59E0B" />
        <MiniStat icon="🔥" label="Ongoing Events" value={events?.ongoing?.length || 0} color="#22C55E" />
        <MiniStat icon="✅" label="Completed" value={events?.previous?.length || 0} color="#6366F1" />
      </div>

      {/* View Events button */}
      <div className="fu" style={{ marginBottom: '28px', animationDelay: '200ms' }}>
        <button
          onClick={() => setShowEvents(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '12px 28px',
            background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`,
            border: 'none', borderRadius: '14px',
            color: 'white', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', letterSpacing: '0.3px',
            boxShadow: `0 6px 20px ${houseColors.primary}40`,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 12px 30px ${houseColors.primary}60`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${houseColors.primary}40`;
          }}
        >
          <span style={{ fontSize: '18px' }}>📅</span>
          <span>View All Events</span>
          <span style={{ opacity: 0.8 }}>→</span>
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
