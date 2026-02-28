const House = require('../models/House');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get global dashboard (all houses overview)
// @route   GET /api/admin/dashboard
exports.getGlobalDashboard = async (req, res) => {
  try {
    const houses = await House.find()
      .populate('mentorId', 'name email')
      .populate('teamLeadId', 'name email');

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });

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
        publishedEvents,
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
      (e) => e.status === 'published' && new Date(e.date) >= new Date()
    );
    const previous = events.filter(
      (e) => e.status === 'published' && new Date(e.date) < new Date()
    );
    const pending = events.filter((e) => e.status === 'pending');

    res.json({ success: true, ongoing, previous, pending, all: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
