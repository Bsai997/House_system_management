import { useState, useEffect } from 'react';
import { HiX, HiStar, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { getStudentPoints } from '../services/api';
import { HOUSE_COLORS } from '../utils/constants';

const StudentDetailModal = ({ isOpen, onClose, studentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true);
      setData(null);
      getStudentPoints(studentId)
        .then((res) => setData(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  const houseColor = data?.student?.house?.name
    ? HOUSE_COLORS[data.student.house.name]
    : null;
  const primaryColor = houseColor?.primary || '#7c3aed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeUp 0.3s ease' }}
      >
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div className="relative overflow-hidden">
          <div
            className="px-6 py-5 text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${houseColor?.dark || '#5b21b6'})` }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition text-white"
            >
              <HiX size={18} />
            </button>

            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
                <div className="space-y-2">
                  <div className="w-32 h-5 rounded bg-white/20 animate-pulse" />
                  <div className="w-24 h-4 rounded bg-white/20 animate-pulse" />
                </div>
              </div>
            ) : data?.student ? (
              <div>
                <h2 className="text-xl font-bold">{data.student.name}</h2>
                <p className="text-white/80 text-sm mt-0.5">
                  {data.student.regdNo || 'N/A'} · {data.student.department || '—'} · Year {data.student.year || '—'}
                </p>
                {data.student.house && (
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
                    🏠 House {data.student.house.name}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: primaryColor }} />
            </div>
          ) : data ? (
            <>
              {/* Points Summary */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-2xl font-bold" style={{ color: primaryColor }}>{data.student.totalPoints}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Total Points</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-2xl font-bold text-emerald-600">{data.totalFromEvents}</p>
                  <p className="text-xs text-gray-500 mt-0.5">From Events</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-2xl font-bold text-amber-600">{data.bonusPoints}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Bonus Points</p>
                </div>
              </div>

              {/* Points History */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Points Breakdown ({data.pointHistory.length} events)
              </h3>

              {data.pointHistory.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="text-sm text-gray-400">No event participation yet</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {data.pointHistory.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{entry.eventName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <HiCalendar size={12} />
                            {new Date(entry.eventDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          {entry.venue && (
                            <span className="inline-flex items-center gap-1">
                              <HiLocationMarker size={12} />
                              {entry.venue}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3 shrink-0">
                        <HiStar className="text-amber-400" size={16} />
                        <span className="font-bold text-sm" style={{ color: primaryColor }}>
                          +{entry.pointsAwarded}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">😕</p>
              <p className="text-sm text-gray-400">Failed to load student details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
