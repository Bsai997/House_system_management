const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Participation = require('../models/Participation');
const Activity = require('../models/Activity');
const { protect, authorize } = require('../middleware/auth');
const { validateMongoId, validateHouseIdParam, validateUpdateProfile } = require('../middleware/validate');

// @desc    Get student point breakdown (public)
// @route   GET /api/users/:id/points
router.get('/:id/points', validateMongoId, async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('name regdNo year department totalPoints houseId')
      .populate('houseId', 'name color');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get all participations where points were awarded
    const participations = await Participation.find({
      studentId: req.params.id,
      status: 'present',
      pointsAwarded: { $gt: 0 },
    })
      .populate({
        path: 'eventId',
        select: 'name date venue housePoints',
      })
      .sort({ createdAt: -1 });

    const pointHistory = participations
      .filter((p) => p.eventId) // filter out deleted events
      .map((p) => ({
        type: 'event',
        eventName: p.eventId.name,
        eventDate: p.eventId.date,
        venue: p.eventId.venue,
        pointsAwarded: p.pointsAwarded,
        date: p.updatedAt,
      }));

    // Get manual point activities
    const activities = await Activity.find({ studentId: req.params.id })
      .populate('addedBy', 'name role')
      .sort({ createdAt: -1 });

    const activityHistory = activities.map((a) => ({
      type: a.activityType || 'bonus',
      reason: a.reason,
      pointsAwarded: a.points,
      addedBy: a.addedBy?.name || 'Unknown',
      date: a.createdAt,
    }));

    // Merge and sort by date descending
    const allHistory = [...pointHistory, ...activityHistory].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const totalFromEvents = pointHistory.reduce((sum, p) => sum + p.pointsAwarded, 0);
    const totalFromBonus = activityHistory
      .filter((a) => a.type === 'bonus')
      .reduce((sum, a) => sum + a.pointsAwarded, 0);
    const totalPenalties = activityHistory
      .filter((a) => a.type === 'penalty')
      .reduce((sum, a) => sum + a.pointsAwarded, 0);

    res.json({
      success: true,
      student: {
        name: student.name,
        regdNo: student.regdNo,
        year: student.year,
        department: student.department,
        totalPoints: student.totalPoints,
        house: student.houseId,
      },
      pointHistory: allHistory,
      totalFromEvents,
      bonusPoints: totalFromBonus,
      totalPenalties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get users by house
// @route   GET /api/users/house/:houseId
router.get('/house/:houseId', protect, validateHouseIdParam, async (req, res) => {
  try {
    const users = await User.find({ houseId: req.params.houseId })
      .select('name regdNo email year department role totalPoints')
      .sort({ totalPoints: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user profile (name only)
// @route   PUT /api/users/profile
router.put('/profile', protect, validateUpdateProfile, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    ).populate('houseId');

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        house: user.houseId,
        regdNo: user.regdNo,
        year: user.year,
        department: user.department,
        totalPoints: user.totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get student rank in house
// @route   GET /api/users/my-rank
router.get('/my-rank', protect, authorize('student'), async (req, res) => {
  try {
    const houseId = req.user.houseId._id || req.user.houseId;
    const students = await User.find({ houseId, role: 'student' })
      .select('totalPoints')
      .sort({ totalPoints: -1 });

    const rank = students.findIndex((s) => s._id.toString() === req.user._id.toString()) + 1;

    res.json({
      success: true,
      rank,
      totalStudents: students.length,
      totalPoints: req.user.totalPoints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
