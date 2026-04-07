const express = require('express');
const router = express.Router();
const {
  createAdminEvent,
  getAllAdminEvents,
  deleteAdminEvent,
} = require('../controllers/adminEvent.controller');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createAdminEvent);
router.get('/', protect, getAllAdminEvents);
router.delete('/:id', protect, deleteAdminEvent);

module.exports = router;
