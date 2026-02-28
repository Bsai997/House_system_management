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

router.post('/register', protect, authorize('student'), registerForEvent);
router.get('/my-participations', protect, authorize('student'), getMyParticipations);
router.get('/event/:eventId', protect, authorize('teamlead', 'mentor', 'admin'), getEventRegistrations);
router.get('/event/:eventId/all', protect, authorize('teamlead', 'mentor', 'admin'), getAllEventAttendance);
router.put('/:id/mark', protect, authorize('teamlead'), markAttendance);

module.exports = router;
