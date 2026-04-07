
import { useEffect, useState, useRef } from 'react';
import { getGlobalDashboard } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { getHouseColor, isImageLogo } from '../../utils/constants';


/* ─── Animated Counter ─── */
function AnimatedCounter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (value == null) return;
    const start = performance.now();
    const from = 0;
    const to = Number(value);

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{display}</>;
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, color, gradient, delay = 0 }) {
  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-200/40 border border-purple-100/60 p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/50 cursor-pointer relative overflow-hidden"
      style={{ position: 'relative', animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient blob */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '100px', height: '100px',
        background: `radial-gradient(circle, ${color}30, transparent 70%)`,
        borderRadius: '50%',
      }} />

      {/* Icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12" style={{
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 'clamp(18px, 4vw, 22px)',
        marginBottom: '12px',
        boxShadow: `0 4px 15px ${color}20`,
        color: '#222',
      }}>
        {icon}
      </div>

      {/* Value */}
      <div
        className="text-3xl sm:text-4xl md:text-[42px] font-extrabold leading-none mb-1.5 tabular-nums"
        style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
      >
        <AnimatedCounter value={value} />
      </div>

      {/* Label */}
      <p style={{ color: '#444', fontSize: '13px', fontWeight: '500', margin: 0, letterSpacing: '0.5px' }}>
        {label}
      </p>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
      }} />
    </div>
  );
}

/* ─── House Leaderboard Row ─── */
function HouseRow({ house, index, maxPoints, animated }) {
  const colors = getHouseColor(house.name);
  const medals = ['🥇', '🥈', '🥉'];
  const barWidth = animated ? Math.max((house.totalPoints / maxPoints) * 100, 4) : 0;
  const isTop = index === 0;

  return (
    <div
      className={`relative flex items-center gap-3 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-3 cursor-pointer transition-all duration-300 border ${
        isTop
          ? 'bg-amber-50/80 border-amber-200/60 hover:bg-amber-50 hover:shadow-lg'
          : 'bg-white/80 border-purple-100/50 hover:bg-white hover:shadow-lg hover:shadow-purple-200/30'
      }`}
    >
      <div className="w-8 sm:w-10 text-center shrink-0">
        {index < 3 ? <span className="text-xl sm:text-2xl">{medals[index]}</span> : <span className="text-sm sm:text-base font-bold text-gray-400">#{index + 1}</span>}
      </div>
      <div
        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-xl sm:text-2xl"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`, boxShadow: `0 4px 15px ${colors.primary}40` }}
      >
        {isImageLogo(house.name) ? (
          <img src={`/${house.name.toLowerCase()}-logo.png`} alt={house.name} className="w-full h-full object-cover" />
        ) : (
          <span className="drop-shadow-md">{house.logo || '🏠'}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base m-0 truncate">{house.name}</h4>
          {isTop && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-600 bg-amber-100 border border-amber-200/60 shrink-0">LEADING</span>
          )}
        </div>
        <p className="text-xs text-gray-500 m-0 mb-1.5 sm:mb-2.5 font-medium">
          {house.eventsCount || 0} events · {house.studentsCount ?? 0} students
        </p>
        <div className="h-1.5 sm:h-2 rounded-full overflow-hidden bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${colors.primary}, ${colors.dark})` }}
          />
        </div>
      </div>
      <div className="text-right shrink-0 pl-2 sm:pl-4">
        <div
          className="text-lg sm:text-2xl md:text-3xl font-extrabold tabular-nums leading-none"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          <AnimatedCounter value={house.totalPoints} />
        </div>
        <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">pts</p>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ─── */
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);
  const leaderboardRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getGlobalDashboard();
        setData(res.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (loading || !data) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.1 }
    );
    if (leaderboardRef.current) observer.observe(leaderboardRef.current);
    return () => observer.disconnect();
  }, [loading, data]);

  if (loading) return (
    <div style={{ padding: '20px' }}>
      <LoadingSkeleton type="table" count={5} />
    </div>
  );

  const maxPoints = data?.dashboard
    ? Math.max(...data.dashboard.map(h => h.totalPoints), 1)
    : 1;

  return (
    <div className="space-y-6 sm:space-y-8">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .stat-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        @media (min-width: 640px) {
          .stat-cards-grid { gap: 14px; margin-bottom: 32px; }
        }
        @media (min-width: 768px) {
          .stat-cards-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
        }
      `}</style>

      {/* Stat Cards */}
      <div className="stat-cards-grid" style={{ color: '#111' }}>
        <div className="fade-up" style={{ animationDelay: '100ms' }}>
          <StatCard
            icon="🎓"
            label="Total Students"
            value={data?.stats?.totalStudents ?? 0}
            color="#22C55E"
            gradient="linear-gradient(135deg, #4ade80, #22c55e)"
            delay={100}
          />
        </div>
        <div className="fade-up" style={{ animationDelay: '200ms' }}>
          <StatCard
            icon="🔥"
            label="Ongoing Events"
            value={data?.stats?.ongoingEvents ?? 0}
            color="#F59E0B"
            gradient="linear-gradient(135deg, #fbbf24, #f59e0b)"
            delay={200}
          />
        </div>
        <div className="fade-up" style={{ animationDelay: '300ms' }}>
          <StatCard
            icon="✅"
            label="Completed Events"
            value={data?.stats?.completedEvents ?? 0}
            color="#6366F1"
            gradient="linear-gradient(135deg, #818cf8, #6366f1)"
            delay={300}
          />
        </div>
        <div className="fade-up" style={{ animationDelay: '400ms' }}>
          <StatCard
            icon="🏠"
            label="Active Houses"
            value={data?.dashboard?.length ?? 5}
            color="#8B5CF6"
            gradient="linear-gradient(135deg, #a78bfa, #8b5cf6)"
            delay={400}
          />
        </div>
      </div>



      {/* Leaderboard section */}
      <div className="fade-up" style={{ animationDelay: '500ms' }} ref={leaderboardRef}>
        {/* Section header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-6 text-center w-full">
          <div>
            <div className="flex flex-col items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-2xl">🏆</div>
              <h2 className="text-xl font-extrabold m-0 text-gray-900">Global House Leaderboard</h2>
              <p className="text-gray-500 text-sm m-0 font-medium">Real-time rankings across all 5 houses</p>
            </div>
          </div>

        </div>

        {/* Leaderboard container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-purple-100/60 shadow-xl shadow-purple-200/40 p-4 sm:p-6 w-full max-w-[900px] mx-auto overflow-x-hidden">
          {data?.dashboard?.length > 0 ? (
            data.dashboard.map((house, i) => (
              <HouseRow
                key={house._id}
                house={house}
                index={i}
                maxPoints={maxPoints}
                animated={animated}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-gray-500 text-base font-semibold">No leaderboard data available</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-xs mt-4 font-medium">
          Rankings update automatically · Points based on event participation and performance
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
