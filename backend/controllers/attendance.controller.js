const Participation = require('../models/Participation');
const Event = require('../models/Event');
const User = require('../models/User');
const House = require('../models/House');

// @desc    Register student for event
// @route   POST /api/attendance/register
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Event is not published yet' });
    }

    // Check if already registered
    const existing = await Participation.findOne({
      eventId,
      studentId: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    const participation = await Participation.create({
      eventId,
      studentId: req.user._id,
      status: 'registered',
    });

    // Add student to event participants
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { participants: req.user._id },
      $inc: { participationCount: 1 },
    });

    res.status(201).json({ success: true, participation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get registrations for an event (Team Lead)
// @route   GET /api/attendance/event/:eventId
exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Participation.find({
      eventId: req.params.eventId,
      status: 'registered',
    })
      .populate('studentId', 'name regdNo email year department houseId totalPoints')
      .populate('eventId', 'name housePoints');

    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance (present/absent)
// @route   PUT /api/attendance/:id/mark
exports.markAttendance = async (req, res) => {
  try {
    const { status } = req.body; // 'present' or 'absent'

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const participation = await Participation.findById(req.params.id).populate('eventId');
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation record not found' });
    }

    if (participation.status !== 'registered') {
      return res.status(400).json({ success: false, message: 'Attendance already marked' });
    }

    participation.status = status;

    if (status === 'present') {
      const eventPoints = participation.eventId.housePoints;
      participation.pointsAwarded = eventPoints;

      // Add points to student
      await User.findByIdAndUpdate(participation.studentId, {
        $inc: { totalPoints: eventPoints },
      });

      // Add points to house
      const student = await User.findById(participation.studentId);
      if (student.houseId) {
        await House.findByIdAndUpdate(student.houseId, {
          $inc: { totalPoints: eventPoints },
        });
      }
    }

    await participation.save();

    res.json({ success: true, participation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's participation history
// @route   GET /api/attendance/my-participations
exports.getMyParticipations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { studentId: req.user._id, status: 'present' };
    const total = await Participation.countDocuments(filter);
    const participations = await Participation.find(filter)
      .populate({
        path: 'eventId',
        select: 'name date houseId housePoints status',
        populate: { path: 'houseId', select: 'name color logo' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      participations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all attendance for an event (including marked)
// @route   GET /api/attendance/event/:eventId/all
exports.getAllEventAttendance = async (req, res) => {
  try {
    const attendance = await Participation.find({ eventId: req.params.eventId })
      .populate('studentId', 'name regdNo email year department houseId totalPoints')
      .populate('eventId', 'name housePoints');

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
