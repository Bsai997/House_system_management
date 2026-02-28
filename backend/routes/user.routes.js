const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get users by house
// @route   GET /api/users/house/:houseId
router.get('/house/:houseId', protect, async (req, res) => {
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
router.put('/profile', protect, async (req, res) => {
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
