import { useState } from 'react';
import { addMember } from '../services/api';
import toast from 'react-hot-toast';
import { HiX, HiUser, HiMail, HiLockClosed, HiIdentification, HiOfficeBuilding } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const BRANCHES = ['CSD', 'CSIT'];

const AddTeamLeadModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    regdNo: '',
    department: '',
  });

  const resetAndClose = () => {
    setForm({ name: '', email: '', password: '', regdNo: '', department: '' });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.regdNo || !form.department) {
      return toast.error('Please fill all fields');
    }
    setLoading(true);
    try {
      await addMember({
        ...form,
        role: 'teamlead',
        houseId: user?.house?._id,
      });
      toast.success('Team Lead added successfully!', { duration: 4000 });
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add team lead');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in"
        style={{ animation: 'fadeInScale 0.25s ease-out' }}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <HiX size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
              🧑‍💼
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Team Lead</h2>
              <p className="text-white/70 text-xs">House {user?.house?.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div className="relative">
            <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white outline-none transition text-sm"
            />
          </div>
          <div className="relative">
            <HiIdentification className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Registration Number"
              value={form.regdNo}
              onChange={(e) => setForm({ ...form, regdNo: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white outline-none transition text-sm"
            />
          </div>
          <div className="relative">
            <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white outline-none transition text-sm"
            />
          </div>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white outline-none transition text-sm"
            />
          </div>
          <div className="relative">
            <HiOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white outline-none transition text-sm appearance-none"
            >
              <option value="">Select Branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={resetAndClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating...
                </span>
              ) : 'Create Team Lead'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AddTeamLeadModal;
