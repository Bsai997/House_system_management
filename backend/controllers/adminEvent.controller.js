const AdminEvent = require('../models/AdminEvent');
const House = require('../models/House');

// @desc    Create admin event
// @route   POST /api/admin-events/create
exports.createAdminEvent = async (req, res) => {
  try {
    const { name, participationPoints, winningPoints } = req.body;

    if (!name || participationPoints === undefined || winningPoints === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and points fields are required' 
      });
    }

    const adminEvent = await AdminEvent.create({
      name: name.trim(),
      participationPoints: Number(participationPoints),
      winningPoints: Number(winningPoints),
    });

    const populated = await AdminEvent.findById(adminEvent._id)
      .populate('participants', 'name email');

    res.status(201).json({ success: true, event: populated });
  } catch (error) {
    console.error('Create Admin Event Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all admin events
// @route   GET /api/admin-events
exports.getAllAdminEvents = async (req, res) => {
  try {
    const adminEvents = await AdminEvent.find()
      .populate('participants', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, events: adminEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete admin event
// @route   DELETE /api/admin-events/:id
exports.deleteAdminEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const adminEvent = await AdminEvent.findByIdAndDelete(id);

    if (!adminEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
