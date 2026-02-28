import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiX, HiPencil } from 'react-icons/hi';

const ProfileSidebar = ({ isOpen, onClose }) => {
  const { user, logout, loadUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '' });
  const [editingName, setEditingName] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '' });
      setEditingName(false);
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: form.name });
      await loadUser();
      toast.success('Profile updated successfully!');
      setEditingName(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        style={{ transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        className={`fixed top-2 right-4 w-96 bg-white shadow-2xl z-50 overflow-y-auto rounded-2xl max-h-[96vh] ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="mt-2 text-sm text-gray-500 capitalize">{user?.role}</p>
        </div>

        {/* Fields */}
        <div className="px-6 space-y-4">
          {/* Name (editable) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Name
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                disabled={!editingName}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                  editingName
                    ? 'border-blue-400 bg-white focus:ring-2 focus:ring-blue-200'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                } outline-none transition`}
              />
              <button
                onClick={() => setEditingName(!editingName)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                title="Edit name"
              >
                <HiPencil size={16} />
              </button>
            </div>
          </div>

          {/* Registration No (read-only) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Registration No
            </label>
            <div className="mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
              {user?.regdNo || '—'}
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Email
            </label>
            <div className="mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
              {user?.email || '—'}
            </div>
          </div>

          {/* Branch / Department (read-only) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Branch
            </label>
            <div className="mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
              {user?.department || '—'}
            </div>
          </div>

          {/* House (read-only) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              House
            </label>
            <div className="mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
              {user?.house?.name || '—'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 mt-6 pb-6 space-y-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
