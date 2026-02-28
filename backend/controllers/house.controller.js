const House = require('../models/House');
const User = require('../models/User');

// @desc    Get global leaderboard (all houses ranked)
// @route   GET /api/houses/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const houses = await House.find()
      .populate('mentorId', 'name email')
      .populate('teamLeadId', 'name email');

    // Recalculate totalPoints from actual student points
    const housesWithPoints = await Promise.all(
      houses.map(async (house) => {
        const students = await User.find({ houseId: house._id, role: 'student' });
        const calculatedPoints = students.reduce((sum, s) => sum + s.totalPoints, 0);
        // Sync stored value if different
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
    const leaderboard = housesWithPoints.map((house, index) => ({
      rank: index + 1,
      ...house,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get internal house dashboard (students in a house ranked)
// @route   GET /api/houses/:houseId/dashboard
exports.getHouseDashboard = async (req, res) => {
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

    // Add rank
    const rankedStudents = students.map((student, index) => ({
      rank: index + 1,
      ...student.toObject(),
    }));

    res.json({
      success: true,
      house,
      students: rankedStudents,
      totalStudents: students.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all houses
// @route   GET /api/houses
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find()
      .populate('mentorId', 'name email')
      .populate('teamLeadId', 'name email');

    res.json({ success: true, houses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single house
// @route   GET /api/houses/:id
exports.getHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id)
      .populate('mentorId', 'name email')
      .populate('teamLeadId', 'name email');

    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    res.json({ success: true, house });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
