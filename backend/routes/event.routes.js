const express = require('express');
const router = express.Router();
const {
  createEvent,
  getPendingEvents,
  approveEvent,
  publishEvent,
  closeEvent,
  getPublishedEvents,
  getEventsByHouse,
  getMyEvents,
  getEvent,
  getMentorHouseEvents,
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');
const {
  validateCreateEvent,
  validateApproveEvent,
  validateMongoId,
  validateHouseIdParam,
  validatePagination,
} = require('../middleware/validate');

router.get('/published', protect, validatePagination, getPublishedEvents);
router.get('/pending', protect, authorize('mentor'), getPendingEvents);
router.get('/my-events', protect, authorize('teamlead'), validatePagination, getMyEvents);
router.get('/mentor/house', protect, authorize('mentor'), getMentorHouseEvents);
router.get('/house/:houseId', protect, validateHouseIdParam, getEventsByHouse);
router.get('/:id', protect, validateMongoId, getEvent);

router.post('/', protect, authorize('teamlead'), upload.single('poster'), validateCreateEvent, createEvent);
router.put('/:id/approve', protect, authorize('mentor'), validateApproveEvent, approveEvent);
router.put('/:id/publish', protect, authorize('teamlead'), validateMongoId, publishEvent);
router.put('/:id/close', protect, authorize('teamlead'), validateMongoId, closeEvent);

module.exports = router;
