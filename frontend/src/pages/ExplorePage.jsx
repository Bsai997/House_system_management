import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHouses, getTopPerformers, getStudentPoints } from '../services/api';
import { HOUSE_COLORS, HOUSE_LOGOS } from '../utils/constants';
import { HiChevronDown, HiStar, HiCalendar, HiLocationMarker, HiUser } from 'react-icons/hi';

const ExplorePage = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [houses, setHouses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [houseFilter, setHouseFilter] = useState('');

  // Inline expand
  const [expandedId, setExpandedId] = useState(null);
  const [expandData, setExpandData] = useState({});
  const [expandLoading, setExpandLoading] = useState(null);

  const handleRowClick = async (studentId) => {
    if (expandedId === studentId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(studentId);
    if (expandData[studentId]) return;
    setExpandLoading(studentId);
    try {
      const res = await getStudentPoints(studentId);
      setExpandData((prev) => ({ ...prev, [studentId]: res.data }));
    } catch {
      setExpandData((prev) => ({ ...prev, [studentId]: null }));
    } finally {
      setExpandLoading(null);
    }
  };

  useEffect(() => {
    getAllHouses()
      .then((res) => setHouses(res.data.houses))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setStudents([]);
    setPage(1);
    fetchStudents(1, true);
  }, [search, yearFilter, deptFilter, houseFilter]);

  const fetchStudents = async (pageNum, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = { page: pageNum, limit: 20 };
      if (search) params.search = search;
      if (yearFilter) params.year = yearFilter;
      if (deptFilter) params.department = deptFilter;
      if (houseFilter) params.houseId = houseFilter;

      const res = await getTopPerformers(params);
      if (reset) {
        setStudents(res.data.students);
      } else {
        setStudents((prev) => [...prev, ...res.data.students]);
      }
      setPagination(res.data.pagination);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStudents(nextPage, false);
    
    // Smooth scroll to table after a brief delay to see new items
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 300);
  };

  // Get unique departments from houses data won't work - we just use common ones
  const departments = ['CSD', 'CSIT'];

  const houseEntries = Object.entries(HOUSE_COLORS).map(([name, colors]) => ({
    name,
    primary: colors.primary,
    dark: colors.dark,
    logo: HOUSE_LOGOS[name],
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50/60 via-white to-white text-gray-800">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-150 h-150 rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-125 h-125 rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <section className="relative z-20 w-full bg-white pt-4 pb-4 border-b border-gray-200">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <img src="/srkrec.png" alt="SRKREC Logo" className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-purple-200" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-400 tracking-wide mb-1">SRKREC</span>
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-black">CSD & CSIT Department</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 rounded-full font-semibold text-base text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7)' }}
          >
            ← Back
          </button>
        </div>
      </section>

      {/* Five House Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Five Houses of Excellence</h2>
          <p className="text-gray-400 text-lg mt-2 max-w-xl mx-auto">Each house represents unique values and fosters a spirit of healthy competition</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {houseEntries.map((house) => {
            const matchedHouse = houses.find((h) => h.name === house.name);
            return (
              <div
                key={house.name}
                className="group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{ background: `linear-gradient(180deg, ${house.primary}, ${house.dark})`, minHeight: '250px' }}
              >
                {/* House name */}
                <div className="relative z-10 p-4">
                  <h3 className="text-lg font-bold text-white">{house.name}</h3>
                  {house.name === 'Agni' && (
                    <p className="text-xs text-white/80 mt-2 italic font-semibold leading-relaxed">
                      "Fire doesn't fear the darkness — it destroys it."
                    </p>
                  )}
                  {house.name === 'Vayu' && (
                    <p className="text-xs text-white/80 mt-2 italic font-semibold leading-relaxed">
                      "Air doesn't compete… it simply surrounds everything."
                    </p>
                  )}
                  {house.name === 'Prudhvi' && (
                    <p className="text-xs text-white/80 mt-2 italic font-semibold leading-relaxed">
                      "Earth never competes with others, yet it holds the whole world."
                    </p>
                  )}
                  {house.name === 'Jal' && (
                    <p className="text-xs text-white/80 mt-2 italic font-semibold leading-relaxed">
                      "Water bends but never breaks; it finds its way through every obstacle."
                    </p>
                  )}
                  {house.name === 'Akash' && (
                    <p className="text-xs text-white/80 mt-2 italic font-semibold leading-relaxed">
                      "The sky knows no boundaries; it inspires infinite possibilities."
                    </p>
                  )}
                </div>

                {/* House logo background */}
                <div className="absolute inset-0">
                  <img src={house.logo} alt={house.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${house.primary}cc 0%, ${house.dark}99 100%)` }} />

                {/* Points at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <div className="text-center text-white/90 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-xl py-2.5">
                    {matchedHouse ? `${matchedHouse.totalPoints || 0} Points` : '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <hr className="border-t border-gray-200" />
      </div>

      {/* Search & Filters */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search student by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition-all duration-300"
            />
          </div>

          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* House filter */}
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          >
            <option value="">All Houses</option>
            {houses.map((h) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(search || yearFilter || deptFilter || houseFilter) && (
            <button
              onClick={() => { setSearch(''); setYearFilter(''); setDeptFilter(''); setHouseFilter(''); }}
              className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors whitespace-nowrap"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Top Performers Table */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#65a30d" className="hover:scale-110 transition-transform duration-300"><path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35Zm115-93q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z"/></svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Top Performers</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-lg font-semibold text-gray-600">No students found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div ref={tableRef} className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden opacity-0 animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">RegdNo</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">House</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map((student, index) => {
                      const rank = index + 1;
                      const houseName = student.houseId?.name;
                      const houseColor = HOUSE_COLORS[houseName];
                      const isExpanded = expandedId === student._id;
                      const detail = expandData[student._id];
                      const isLoading = expandLoading === student._id;
                      return (
                        <>
                        <tr key={student._id} className={`hover:bg-purple-50/40 transition-colors cursor-pointer select-none ${isExpanded ? 'bg-purple-50/50' : ''}`} onClick={() => handleRowClick(student._id)}>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${rank <= 3 ? 'bg-orange-100 text-orange-600' : 'text-gray-500'}`}>
                              {rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            <span className="flex items-center gap-1.5">
                              {student.name}
                              <HiChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{student.regdNo || '—'}</td>
                          <td className="px-6 py-4 text-gray-600">{student.year || '—'}</td>
                          <td className="px-6 py-4 text-gray-600">{student.department || '—'}</td>
                          <td className="px-6 py-4">
                            {houseName ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
                                style={{ backgroundColor: houseColor?.primary || '#6b7280' }}>
                                {houseName}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-600">{student.totalPoints}</td>
                        </tr>

                        {/* Inline expanded detail row */}
                        {isExpanded && (
                          <tr key={`${student._id}-detail`}>
                            <td colSpan={7} className="px-0 py-0">
                              <div className="bg-linear-to-r from-purple-50/80 via-white to-purple-50/80 border-t border-b border-purple-100">
                                <div className="px-8 py-5">
                                  {isLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
                                      <span className="ml-3 text-sm text-gray-400">Loading point history...</span>
                                    </div>
                                  ) : detail === null ? (
                                    <p className="text-center text-sm text-gray-400 py-4">Failed to load details</p>
                                  ) : detail ? (
                                    <>
                                      {/* Summary chips */}
                                      <div className="flex flex-wrap gap-3 mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">
                                          <HiStar size={14} /> Total: {detail.student.totalPoints} pts
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold">
                                          Events: {detail.totalFromEvents} pts
                                        </span>
                                        {detail.bonusPoints > 0 && (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-sm font-semibold">
                                            Bonus: {detail.bonusPoints} pts
                                          </span>
                                        )}
                                        {detail.totalPenalties > 0 && (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm font-semibold">
                                            Penalties: −{detail.totalPenalties} pts
                                          </span>
                                        )}
                                      </div>

                                      {detail.pointHistory.length === 0 ? (
                                        <p className="text-sm text-gray-400 py-2">No event participation recorded yet.</p>
                                      ) : (
                                        <div className="space-y-2">
                                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Point History</p>
                                          {detail.pointHistory.map((entry, i) => (
                                            <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-shadow">
                                              <div className="flex-1 min-w-0">
                                                {entry.type === 'event' ? (
                                                  <>
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{entry.eventName}</p>
                                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                                                      <span className="inline-flex items-center gap-1">
                                                        <HiCalendar size={11} />
                                                        {new Date(entry.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                      </span>
                                                      {entry.venue && (
                                                        <span className="inline-flex items-center gap-1">
                                                          <HiLocationMarker size={11} />
                                                          {entry.venue}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </>
                                                ) : (
                                                  <>
                                                    <div className="flex items-center gap-2">
                                                      {entry.type === 'penalty' ? (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-100 text-red-700">Penalty</span>
                                                      ) : (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-700">Bonus</span>
                                                      )}
                                                      <p className="text-sm font-semibold text-gray-800 truncate">{entry.reason}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                                                      <span className="inline-flex items-center gap-1">
                                                        <HiUser size={11} />
                                                        {entry.type === 'penalty' ? 'Deducted by' : 'Added by'} {entry.addedBy}
                                                      </span>
                                                      <span className="inline-flex items-center gap-1">
                                                        <HiCalendar size={11} />
                                                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                      </span>
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                              <span className={`ml-3 shrink-0 inline-flex items-center gap-1 text-sm font-bold ${entry.type === 'penalty' ? 'text-red-500' : ''}`} style={entry.type !== 'penalty' ? { color: houseColor?.primary || '#7c3aed' } : undefined}>
                                                <HiStar size={14} className={entry.type === 'penalty' ? 'text-red-400' : 'text-amber-400'} />
                                                {entry.type === 'penalty' ? '−' : '+'}{entry.pointsAwarded}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Show More Button - Sticky */}
            {pagination && page < pagination.pages && (
              <div className="sticky bottom-0 left-0 right-0 flex justify-center mt-8 py-6 bg-gradient-to-t from-white via-white to-transparent backdrop-blur-sm z-20">
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full font-semibold text-base text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7)' }}
                >
                  {loadingMore ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Loading...
                    </span>
                  ) : (
                    `Show 20 More (${students.length} of ${pagination.total})`
                  )}
                </button>
              </div>
            )}

            {/* Total count */}
            {pagination && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Showing {students.length} of {pagination.total} students
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ExplorePage;
