const House = require('../models/House');
const User = require('../models/User');
const Activity = require('../models/Activity');

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
        obj.studentsCount = students.length;
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

// @desc    Get top performers (public, paginated)
// @route   GET /api/houses/top-performers
exports.getTopPerformers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { role: 'student' };

    // Optional filters
    if (req.query.year) {
      filter.year = parseInt(req.query.year);
    }
    if (req.query.department) {
      filter.department = { $regex: req.query.department, $options: 'i' };
    }
    if (req.query.houseId) {
      filter.houseId = req.query.houseId;
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('name regdNo year department totalPoints houseId')
      .populate('houseId', 'name color')
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      students,
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

// @desc    Add/remove points to a student (teamlead/mentor)
// @route   POST /api/houses/add-points
exports.addPointsToStudent = async (req, res) => {
  try {
    const { studentId, points, reason, type } = req.body;
    const activityType = type || 'bonus';
    const pointsValue = parseInt(points);

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (student.role !== 'student') {
      return res.status(400).json({ success: false, message: 'Points can only be modified for students' });
    }

    // Ensure teamlead can only modify points for students in their own house
    const userHouseId = (req.user.houseId._id || req.user.houseId).toString();
    if (student.houseId.toString() !== userHouseId) {
      return res.status(403).json({ success: false, message: 'You can only modify points for students in your house' });
    }

    if (activityType === 'penalty') {
      if (student.totalPoints < pointsValue) {
        return res.status(400).json({ success: false, message: `Student only has ${student.totalPoints} points. Cannot deduct ${pointsValue}.` });
      }
      student.totalPoints -= pointsValue;
    } else {
      student.totalPoints += pointsValue;
    }
    await student.save();

    // Log the activity
    await Activity.create({
      studentId: student._id,
      addedBy: req.user._id,
      points: pointsValue,
      activityType,
      reason,
      houseId: student.houseId,
    });

    // Update house total points
    const houseStudents = await User.find({ houseId: student.houseId, role: 'student' });
    const totalHousePoints = houseStudents.reduce((sum, s) => sum + s.totalPoints, 0);
    await House.findByIdAndUpdate(student.houseId, { totalPoints: totalHousePoints });

    res.json({
      success: true,
      message: activityType === 'penalty'
        ? `${pointsValue} points deducted from ${student.name}`
        : `${pointsValue} points added to ${student.name}`,
      student: {
        id: student._id,
        name: student.name,
        totalPoints: student.totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
