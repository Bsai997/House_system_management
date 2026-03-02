const House = require('../models/House');
const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');

// @desc    Get global dashboard (all houses overview)
// @route   GET /api/admin/dashboard
exports.getGlobalDashboard = async (req, res) => {
  try {
    const houses = await House.find()
      .populate('mentorId', 'name email')
      .populate('teamLeadId', 'name email');

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEvents = await Event.countDocuments();
    const ongoingEvents = await Event.countDocuments({ status: 'published' });
    const completedEvents = await Event.countDocuments({ status: 'closed' });

    // Recalculate totalPoints from actual student points for each house
    const housesWithPoints = await Promise.all(
      houses.map(async (house) => {
        const students = await User.find({ houseId: house._id, role: 'student' });
        const calculatedPoints = students.reduce((sum, s) => sum + s.totalPoints, 0);
        if (house.totalPoints !== calculatedPoints) {
          await House.findByIdAndUpdate(house._id, { totalPoints: calculatedPoints });
        }
        const obj = house.toObject();
        obj.totalPoints = calculatedPoints;
        obj.studentsCount = students.length;
        return obj;
      })
    );

    // Sort by points descending and add rank
    housesWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);
    const dashboard = housesWithPoints.map((house, index) => ({
      rank: index + 1,
      ...house,
    }));

    res.json({
      success: true,
      dashboard,
      stats: {
        totalHouses: houses.length,
        totalStudents,
        totalEvents,
        ongoingEvents,
        completedEvents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get house dashboard for admin (same as mentor about house)
// @route   GET /api/admin/house/:houseId
exports.getAdminHouseDashboard = async (req, res) => {
  try {
    const house = await House.findById(req.params.houseId)
      .populate('mentorId', 'name email')
      .populate('teamLeadId', 'name email');

    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    const students = await User.find({
      houseId: req.params.houseId,
      role: 'student',
    })
      .select('name regdNo email year department totalPoints')
      .sort({ totalPoints: -1 });

    // Recalculate house totalPoints from actual student points
    const calculatedPoints = students.reduce((sum, s) => sum + s.totalPoints, 0);
    if (house.totalPoints !== calculatedPoints) {
      await House.findByIdAndUpdate(req.params.houseId, { totalPoints: calculatedPoints });
      house.totalPoints = calculatedPoints;
    }

    const events = await Event.find({ houseId: req.params.houseId })
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    const rankedStudents = students.map((student, index) => ({
      rank: index + 1,
      ...student.toObject(),
    }));

    res.json({
      success: true,
      house,
      students: rankedStudents,
      events,
      totalStudents: students.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get house events for admin
// @route   GET /api/admin/house/:houseId/events
exports.getAdminHouseEvents = async (req, res) => {
  try {
    const events = await Event.find({ houseId: req.params.houseId })
      .populate('houseId', 'name color logo')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    const ongoing = events.filter(
      (e) => e.status === 'published'
    );
    const previous = events.filter(
      (e) => e.status === 'closed'
    );
    const pending = events.filter((e) => e.status === 'pending');

    res.json({ success: true, ongoing, previous, pending, all: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a mentor or team lead
// @route   POST /api/admin/add-member
exports.addMember = async (req, res) => {
  try {
    const { name, email, password, role, houseId, department, regdNo, year } = req.body;

    if (!['mentor', 'teamlead'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be mentor or teamlead' });
    }

    // Mentors can only add teamleads for their own house
    if (req.user.role === 'mentor') {
      if (role !== 'teamlead') {
        return res.status(403).json({ success: false, message: 'Mentors can only add team leads' });
      }
      if (houseId !== req.user.houseId._id.toString() && houseId !== req.user.houseId.toString()) {
        return res.status(403).json({ success: false, message: 'You can only add team leads to your own house' });
      }
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    if (regdNo) {
      const existingRegd = await User.findOne({ regdNo });
      if (existingRegd) {
        return res.status(400).json({ success: false, message: 'Registration number already exists' });
      }
    }

    // Check house exists
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      houseId,
      department,
      regdNo: regdNo || undefined,
      year: year || undefined,
    });

    // Update house with mentor/teamlead
    if (role === 'teamlead') {
      await House.findByIdAndUpdate(houseId, { teamLeadId: user._id });
    } else if (role === 'mentor') {
      await House.findByIdAndUpdate(houseId, { mentorId: user._id });
    }

    res.status(201).json({
      success: true,
      message: `${role === 'mentor' ? 'Mentor' : 'Team Lead'} added successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
