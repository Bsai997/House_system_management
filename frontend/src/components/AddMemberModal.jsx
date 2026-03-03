import { useState, useEffect } from 'react';
import { addMember, getAllHouses } from '../services/api';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';

const BRANCHES = ['CSD', 'CSIT'];

const AddMemberModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('choose'); // 'choose' | 'mentor' | 'teamlead'
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    password: '',
    houseId: '',
    department: '',
  });

  const [teamLeadForm, setTeamLeadForm] = useState({
    name: '',
    regdNo: '',
    email: '',
    password: '',
    houseId: '',
    department: '',
    year: '',
  });

  useEffect(() => {
    if (isOpen) {
      getAllHouses()
        .then((res) => setHouses(res.data.houses || res.data))
        .catch(() => toast.error('Failed to load houses'));
    }
  }, [isOpen]);

  const resetAndClose = () => {
    setStep('choose');
    setMentorForm({ name: '', email: '', password: '', houseId: '', department: '' });
    setTeamLeadForm({ name: '', regdNo: '', email: '', password: '', houseId: '', department: '', year: '' });
    onClose();
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    if (!mentorForm.name || !mentorForm.email || !mentorForm.password || !mentorForm.houseId || !mentorForm.department) {
      return toast.error('Please fill all fields');
    }
    setLoading(true);
    try {
      await addMember({ ...mentorForm, role: 'mentor' });
      toast.success('Mentor added successfully!', { duration: 4000 });
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add mentor');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamLeadSubmit = async (e) => {
    e.preventDefault();
    if (
      !teamLeadForm.name ||
      !teamLeadForm.regdNo ||
      !teamLeadForm.email ||
      !teamLeadForm.password ||
      !teamLeadForm.houseId ||
      !teamLeadForm.department ||
      !teamLeadForm.year
    ) {
      return toast.error('Please fill all fields');
    }
    setLoading(true);
    try {
      await addMember({ ...teamLeadForm, role: 'teamlead', year: Number(teamLeadForm.year) });
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] flex flex-col overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            {step === 'choose' && 'Add Member'}
            {step === 'mentor' && 'Add Mentor'}
            {step === 'teamlead' && 'Add Team Lead'}
          </h2>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Choose Role */}
          {step === 'choose' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">Select the type of member to add:</p>
              <button
                onClick={() => setStep('mentor')}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200 transition">
                  👨‍🏫
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Add a Mentor</p>
                  <p className="text-xs text-gray-500">Faculty mentor for a house</p>
                </div>
              </button>
              <button
                onClick={() => setStep('teamlead')}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-200 transition">
                  🧑‍💼
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Add a Team Lead</p>
                  <p className="text-xs text-gray-500">Student leader for a house</p>
                </div>
              </button>
            </div>
          )}

          {/* Step 2a: Mentor Form */}
          {step === 'mentor' && (
            <form onSubmit={handleMentorSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    placeholder="Enter mentor name"
                    value={mentorForm.name}
                    onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={mentorForm.email}
                    onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={mentorForm.password}
                    onChange={(e) => setMentorForm({ ...mentorForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">House</label>
                    <select
                      value={mentorForm.houseId}
                      onChange={(e) => setMentorForm({ ...mentorForm, houseId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="">Select House</option>
                      {houses.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Branch</label>
                    <select
                      value={mentorForm.department}
                      onChange={(e) => setMentorForm({ ...mentorForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="">Select Branch</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 text-sm shadow-sm"
                >
                  {loading ? 'Creating...' : 'Create Mentor'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2b: Team Lead Form */}
          {step === 'teamlead' && (
            <form onSubmit={handleTeamLeadSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Name</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={teamLeadForm.name}
                      onChange={(e) => setTeamLeadForm({ ...teamLeadForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Regd No</label>
                    <input
                      type="text"
                      placeholder="Reg. number"
                      value={teamLeadForm.regdNo}
                      onChange={(e) => setTeamLeadForm({ ...teamLeadForm, regdNo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={teamLeadForm.email}
                    onChange={(e) => setTeamLeadForm({ ...teamLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={teamLeadForm.password}
                    onChange={(e) => setTeamLeadForm({ ...teamLeadForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">House</label>
                    <select
                      value={teamLeadForm.houseId}
                      onChange={(e) => setTeamLeadForm({ ...teamLeadForm, houseId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="">Select</option>
                      {houses.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Branch</label>
                    <select
                      value={teamLeadForm.department}
                      onChange={(e) => setTeamLeadForm({ ...teamLeadForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="">Select</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Year</label>
                    <select
                      value={teamLeadForm.year}
                      onChange={(e) => setTeamLeadForm({ ...teamLeadForm, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="">Select</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 text-sm shadow-sm"
                >
                  {loading ? 'Creating...' : 'Create Team Lead'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
