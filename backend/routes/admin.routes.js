const express = require('express');
const router = express.Router();
const {
  getGlobalDashboard,
  getAdminHouseDashboard,
  getAdminHouseEvents,
  addMember,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getGlobalDashboard);
router.get('/house/:houseId', protect, authorize('admin'), getAdminHouseDashboard);
router.get('/house/:houseId/events', protect, authorize('admin'), getAdminHouseEvents);
router.post('/add-member', protect, authorize('admin', 'mentor'), addMember);

module.exports = router;
