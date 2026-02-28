const express = require('express');
const router = express.Router();
const {
  createEvent,
  getPendingEvents,
  approveEvent,
  publishEvent,
  getPublishedEvents,
  getEventsByHouse,
  getMyEvents,
  getEvent,
  getMentorHouseEvents,
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/published', protect, getPublishedEvents);
router.get('/pending', protect, authorize('mentor'), getPendingEvents);
router.get('/my-events', protect, authorize('teamlead'), getMyEvents);
router.get('/mentor/house', protect, authorize('mentor'), getMentorHouseEvents);
router.get('/house/:houseId', protect, getEventsByHouse);
router.get('/:id', protect, getEvent);

router.post('/', protect, authorize('teamlead'), upload.single('poster'), createEvent);
router.put('/:id/approve', protect, authorize('mentor'), approveEvent);
router.put('/:id/publish', protect, authorize('teamlead'), publishEvent);

module.exports = router;
