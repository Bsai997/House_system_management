// Validation middleware for auth routes

exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  next();
};

exports.validateCreateEvent = (req, res, next) => {
  const { name, description, venue, date, housePoints } = req.body;

  if (!name || !description || !venue || !date || housePoints === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, description, venue, date, housePoints',
    });
  }

  if (isNaN(housePoints) || housePoints < 0) {
    return res.status(400).json({
      success: false,
      message: 'housePoints must be a valid non-negative number',
    });
  }

  next();
};

exports.validateApproveEvent = (req, res, next) => {
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid status: "approved" or "rejected"',
    });
  }

  next();
};

exports.validateMongoId = (req, res, next) => {
  const { id } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID',
    });
  }

  next();
};

exports.validateHouseIdParam = (req, res, next) => {
  const { houseId } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid house ID',
    });
  }

  next();
};

exports.validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive number',
    });
  }

  if (limit && (isNaN(limit) || limit < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be a positive number',
    });
  }

  next();
};

exports.validateRegisterForEvent = (req, res, next) => {
  const { eventId } = req.body;
  const mongoose = require('mongoose');

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an eventId',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID',
    });
  }

  next();
};

exports.validateMarkAttendance = (req, res, next) => {
  const { status } = req.body;

  if (!status || !['present', 'absent'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid status: "present" or "absent"',
    });
  }

  next();
};

exports.validateEventIdParam = (req, res, next) => {
  const { eventId } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID',
    });
  }

  next();
};

exports.validateAddMember = (req, res, next) => {
  const { name, email, password, role, houseId } = req.body;
  const mongoose = require('mongoose');

  if (!name || !email || !password || !role || !houseId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, password, role, and houseId',
    });
  }

  if (!['mentor', 'teamlead'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role must be "mentor" or "teamlead"',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid house ID',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  next();
};

exports.validateUpdateProfile = (req, res, next) => {
  const { name, email, year, department } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }
  }

  if (year && (isNaN(year) || year < 1 || year > 4)) {
    return res.status(400).json({
      success: false,
      message: 'Year must be a number between 1 and 4',
    });
  }

  next();
};

exports.handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};
