import { useState } from 'react';
import { createEvent } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getHouseColor } from '../../utils/constants';

const TeamLeadHome = () => {
  const { user } = useAuth();
  const houseColors = getHouseColor(user?.house?.name);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    venue: '',
    date: '',
    housePoints: '',
  });
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (poster) formData.append('poster', poster);

      await createEvent(formData);
      toast.success('Event created and sent to mentor for approval!');
      setForm({ name: '', description: '', venue: '', date: '', housePoints: '' });
      setPoster(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">📝 Create New Event</h2>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Poster
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="hidden"
                id="poster-upload"
              />
              <label htmlFor="poster-upload" className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                ) : (
                  <div>
                    <p className="text-4xl mb-2">📸</p>
                    <p className="text-sm text-gray-500">
                      Click to upload poster (JPEG, PNG, WebP)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field h-28 resize-none"
              placeholder="Describe the event..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                className="input-field"
                placeholder="Event venue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House Points *
            </label>
            <input
              type="number"
              name="housePoints"
              value={form.housePoints}
              onChange={handleChange}
              className="input-field"
              placeholder="Points for participation"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50"
            style={{ backgroundColor: houseColors.primary }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Creating...
              </span>
            ) : (
              'Create Event & Send for Approval'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamLeadHome;
