const Event = require('../models/Event');
const House = require('../models/House');
const Participation = require('../models/Participation');

// @desc    Create event (Team Lead only)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { name, description, venue, date, housePoints } = req.body;
    const poster = req.file ? `/uploads/posters/${req.file.filename}` : '';

    const event = await Event.create({
      name,
      description,
      poster,
      venue,
      date,
      houseId: req.user.houseId._id || req.user.houseId,
      createdBy: req.user._id,
      housePoints: Number(housePoints),
      status: 'pending',
    });

    const populated = await Event.findById(event._id)
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending events for mentor approval
// @route   GET /api/events/pending
exports.getPendingEvents = async (req, res) => {
  try {
    const houseId = req.user.houseId._id || req.user.houseId;
    const events = await Event.find({ houseId, status: 'pending' })
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject event (Mentor only)
// @route   PUT /api/events/:id/approve
exports.approveEvent = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify mentor belongs to same house
    const mentorHouseId = (req.user.houseId._id || req.user.houseId).toString();
    if (event.houseId.toString() !== mentorHouseId) {
      return res.status(403).json({ success: false, message: 'Not authorized for this house' });
    }

    event.status = status;
    await event.save();

    const populated = await Event.findById(event._id)
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email');

    res.json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish event (Team Lead only, after approval)
// @route   PUT /api/events/:id/publish
exports.publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Event must be approved by mentor before publishing',
      });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the event creator can publish' });
    }

    event.status = 'published';
    await event.save();

    // Increment house event count
    await House.findByIdAndUpdate(event.houseId, { $inc: { eventsCount: 1 } });

    const populated = await Event.findById(event._id)
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email');

    res.json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all published events (for students)
// @route   GET /api/events/published
exports.getPublishedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'published' })
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get events by house
// @route   GET /api/events/house/:houseId
exports.getEventsByHouse = async (req, res) => {
  try {
    const events = await Event.find({ houseId: req.params.houseId })
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get team lead's events (event history)
// @route   GET /api/events/my-events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .populate('participants', 'name regdNo email year department');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Close event (Team Lead only, after publishing)
// @route   PUT /api/events/:id/close
exports.closeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Only published events can be closed',
      });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the event creator can close this event' });
    }

    event.status = 'closed';
    await event.save();

    const populated = await Event.findById(event._id)
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email');

    res.json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get events for mentor's house (all statuses)
// @route   GET /api/events/mentor/house
exports.getMentorHouseEvents = async (req, res) => {
  try {
    const houseId = req.user.houseId._id || req.user.houseId;
    const events = await Event.find({ houseId })
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
