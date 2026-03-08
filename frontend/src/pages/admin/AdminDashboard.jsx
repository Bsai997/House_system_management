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
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '28px 24px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
        e.currentTarget.style.border = `1px solid ${color}40`;
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${color}20`;
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      {/* Decorative gradient blob */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '100px', height: '100px',
        background: `radial-gradient(circle, ${color}30, transparent 70%)`,
        borderRadius: '50%',
      }} />

      {/* Icon */}
      <div style={{
        width: '48px', height: '48px',
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', marginBottom: '16px',
        boxShadow: `0 4px 15px ${color}20`,
      }}>
        {icon}
      </div>

      {/* Value */}
      <div style={{
        fontSize: '42px', fontWeight: '800',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1, marginBottom: '6px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        <AnimatedCounter value={value} />
      </div>

      {/* Label */}
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', margin: 0, letterSpacing: '0.5px' }}>
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
      style={{
        position: 'relative',
        padding: '20px 24px',
        background: isTop
          ? 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.04))'
          : 'rgba(255,255,255,0.02)',
        border: isTop
          ? '1px solid rgba(251,191,36,0.2)'
          : '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        marginBottom: '12px',
        display: 'flex', alignItems: 'center', gap: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${colors.primary}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isTop
          ? 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.04))'
          : 'rgba(255,255,255,0.02)';
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Rank */}
      <div style={{
        width: '40px', textAlign: 'center', flexShrink: 0,
        fontSize: index < 3 ? '24px' : '16px',
        fontWeight: '700', color: 'rgba(255,255,255,0.4)',
      }}>
        {index < 3 ? medals[index] : `#${index + 1}`}
      </div>

      {/* House logo */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', fontSize: '24px',
        boxShadow: `0 4px 15px ${colors.primary}40`,
      }}>
        {isImageLogo(house.name) ? (
          <img
            src={`/${house.name.toLowerCase()}-logo.png`}
            alt={house.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
            {house.logo || '🏠'}
          </span>
        )}
      </div>

      {/* Name, bar, meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h4 style={{ fontWeight: '700', color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
            {house.name}
          </h4>
          {isTop && (
            <span style={{
              fontSize: '10px', fontWeight: '700', padding: '2px 8px',
              borderRadius: '50px', color: '#F59E0B',
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
              letterSpacing: '0.5px',
            }}>LEADING</span>
          )}
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', fontWeight: '500' }}>
          {house.eventsCount || 0} events · {house.studentsCount ?? 0} students
        </p>
        {/* Progress bar */}
        <div style={{
          height: '6px', borderRadius: '50px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.06)',
        }}>
          <div style={{
            height: '100%', borderRadius: '50px',
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.dark})`,
            transition: 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
            boxShadow: `0 0 8px ${colors.primary}60`,
          }} />
        </div>
      </div>

      {/* Points */}
      <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '16px' }}>
        <div style={{
          fontSize: '28px', fontWeight: '800',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <AnimatedCounter value={house.totalPoints} />
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>pts</p>
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
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .stat-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }
        @media (min-width: 768px) {
          .stat-cards-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }
      `}</style>

      {/* Welcome banner */}
      <div className="fade-up" style={{
        marginBottom: '36px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '20px',
        padding: '28px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.05), transparent)',
          animation: 'glowPulse 3s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '28px' }}>👋</span>
            <h2 style={{
              fontSize: '24px', fontWeight: '800', margin: 0,
              background: 'linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Welcome back, Admin!</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', margin: 0, fontWeight: '500' }}>
            Here's a complete overview of your House Event Management System.
            Monitor all houses, track events, and manage students from one place.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '22px' }}>🏆</span>
              <h2 style={{
                fontSize: '20px', fontWeight: '800', margin: 0, color: 'rgba(255,255,255,0.9)'
              }}>
                Global House Leaderboard
              </h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: 0, fontWeight: '500' }}>
              Real-time rankings across all 5 houses
            </p>
          </div>

          {/* Live badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '50px', padding: '6px 14px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E',
              boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'glowPulse 2s ease-in-out infinite'
            }} />
            <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Leaderboard container */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
        }}>
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
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>No leaderboard data available</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.2)',
          fontSize: '12px', marginTop: '16px', fontWeight: '500',
        }}>
          Rankings update automatically · Points based on event participation and performance
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
