import { useState, useEffect } from 'react';
import { HiX, HiSearch } from 'react-icons/hi';
import { getHouseStudents, addPointsToStudent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getHouseColor } from '../utils/constants';
import toast from 'react-hot-toast';

const AddPointsModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const houseColors = getHouseColor(user?.house?.name);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [mode, setMode] = useState('bonus'); // 'bonus' | 'penalty'

  const isPenalty = mode === 'penalty';

  useEffect(() => {
    if (isOpen && user?.house?._id) {
      setFetching(true);
      getHouseStudents(user.house._id)
        .then((res) => {
          const studentList = (res.data.users || res.data).filter(
            (u) => u.role === 'student'
          );
          setStudents(studentList);
        })
        .catch(() => toast.error('Failed to load students'))
        .finally(() => setFetching(false));
    }
  }, [isOpen, user]);

  const resetAndClose = () => {
    setSearch('');
    setSelectedStudent(null);
    setPoints('');
    setReason('');
    setMode('bonus');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !points || !reason.trim()) {
      return toast.error('Please fill all fields');
    }
    setLoading(true);
    try {
      await addPointsToStudent({
        studentId: selectedStudent._id,
        points: parseInt(points),
        reason: reason.trim(),
        type: mode,
      });
      toast.success(
        isPenalty
          ? `${points} points deducted from ${selectedStudent.name}!`
          : `${points} points added to ${selectedStudent.name}!`
      );
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isPenalty ? 'deduct' : 'add'} points`);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.regdNo && s.regdNo.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] flex flex-col overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            {isPenalty ? 'Remove Points' : 'Add Points'}
          </h2>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          >
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Mode Toggle */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('bonus')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                !isPenalty
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              + Add Points
            </button>
            <button
              type="button"
              onClick={() => setMode('penalty')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                isPenalty
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              − Penalty
            </button>
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Select Student *
            </label>

            {selectedStudent ? (
              <div className="flex items-center justify-between p-3 rounded-xl border-2 bg-gray-50" style={{ borderColor: houseColors?.primary }}>
                <div>
                  <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedStudent.regdNo} · {selectedStudent.department} · Year {selectedStudent.year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-2">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or regd no..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-9 text-sm"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                  {fetching ? (
                    <p className="p-3 text-sm text-gray-400 text-center">Loading students...</p>
                  ) : filteredStudents.length === 0 ? (
                    <p className="p-3 text-sm text-gray-400 text-center">No students found</p>
                  ) : (
                    filteredStudents.map((s) => (
                      <button
                        type="button"
                        key={s._id}
                        onClick={() => {
                          setSelectedStudent(s);
                          setSearch('');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b last:border-b-0 transition"
                      >
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">
                          {s.regdNo} · {s.department} · Year {s.year} · {s.totalPoints} pts
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Points */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Points *
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder={isPenalty ? 'Points to deduct (1-1000)' : 'Enter points (1-1000)'}
              className="input-field"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isPenalty ? 'Reason for penalty...' : 'Reason for adding points...'}
              className="input-field h-20 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedStudent}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50"
            style={{ backgroundColor: isPenalty ? '#ef4444' : (houseColors?.primary || '#3b82f6') }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                {isPenalty ? 'Deducting...' : 'Adding...'}
              </span>
            ) : (
              isPenalty ? 'Deduct Points' : 'Add Points'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPointsModal;
