const jwt = require('jsonwebtoken');
const User = require('../models/User');
const House = require('../models/House');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, houseId, regdNo, year, department } = req.body;

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

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      houseId,
      regdNo,
      year,
      department,
    });

    // If team lead or mentor, update house
    if (role === 'teamlead' && houseId) {
      await House.findByIdAndUpdate(houseId, { teamLeadId: user._id });
    }
    if (role === 'mentor' && houseId) {
      await House.findByIdAndUpdate(houseId, { mentorId: user._id });
    }

    const token = generateToken(user._id);

    const populatedUser = await User.findById(user._id).populate('houseId');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        house: populatedUser.houseId,
        regdNo: populatedUser.regdNo,
        year: populatedUser.year,
        department: populatedUser.department,
        totalPoints: populatedUser.totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('houseId');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
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
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('houseId');
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
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
