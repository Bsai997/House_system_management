const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getEventRegistrations,
  markAttendance,
  getMyParticipations,
  getAllEventAttendance,
} = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middleware/auth');
const {
  validateRegisterForEvent,
  validateMarkAttendance,
  validateEventIdParam,
  validatePagination,
} = require('../middleware/validate');

router.post('/register', protect, authorize('student'), validateRegisterForEvent, registerForEvent);
router.get('/my-participations', protect, authorize('student'), validatePagination, getMyParticipations);
router.get('/event/:eventId', protect, authorize('teamlead', 'mentor', 'admin'), validateEventIdParam, getEventRegistrations);
router.get('/event/:eventId/all', protect, authorize('teamlead', 'mentor', 'admin'), validateEventIdParam, getAllEventAttendance);
router.put('/:id/mark', protect, authorize('teamlead'), validateMarkAttendance, markAttendance);

module.exports = router;
