import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { getPublishedEvents, updateEventPoints } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getHouseColor } from '../utils/constants';
import toast from 'react-hot-toast';

const AddAdminEventModal = ({ isOpen, onClose, onEventAdded }) => {
  const { user } = useAuth();
  const houseColors = getHouseColor(user?.house?.name);
  const [eventName, setEventName] = useState('');
  const [participationPoints, setParticipationPoints] = useState('');
  const [winningPoints, setWinningPoints] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEventName('');
    setParticipationPoints('');
    setWinningPoints('');
  };

  const resetAndClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventName.trim()) {
      return toast.error('Please enter event name');
    }

    if (!participationPoints || !winningPoints) {
      return toast.error('Please fill all point fields');
    }

    setLoading(true);
    try {
      const payload = {
        name: eventName.trim(),
        participationPoints: Number(participationPoints),
        winningPoints: Number(winningPoints),
        housePoints: Number(participationPoints) + Number(winningPoints),
      };

      console.log('Sending payload:', payload);
      // Call API to create or update event
      const response = await updateEventPoints(payload);
      console.log('Response:', response);
      toast.success('Event created successfully!');
      if (onEventAdded) onEventAdded(response.data.event);
      resetAndClose();
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create event';
      toast.error(errorMsg);
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
          <h2 className="text-lg font-bold text-gray-900">Add Event</h2>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          >
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Annual Sports Meet"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Participation Points */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Participation Points *
            </label>
            <input
              type="number"
              value={participationPoints}
              onChange={(e) => setParticipationPoints(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-500 mt-1">Points awarded for participation</p>
          </div>

          {/* Winning Points */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Winning Points *
            </label>
            <input
              type="number"
              value={winningPoints}
              onChange={(e) => setWinningPoints(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-500 mt-1">Points awarded for winning</p>
          </div>

          {/* Summary */}
          {(participationPoints || winningPoints) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
              <p className="text-sm font-semibold text-purple-900 mb-2">Points Summary:</p>
              <p className="text-sm text-purple-700">Total House Points: <strong>{(Number(participationPoints || 0) + Number(winningPoints || 0))}</strong></p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={resetAndClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: `linear-gradient(135deg, ${houseColors.primary}, ${houseColors.dark})`,
              }}
              className="px-4 py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminEventModal;
