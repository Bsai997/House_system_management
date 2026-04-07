const express = require('express');
const router = express.Router();
const {
  getGlobalDashboard,
  getAdminHouseDashboard,
  getAdminHouseEvents,
  addMember,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateAddMember, validateHouseIdParam } = require('../middleware/validate');

router.get('/dashboard', protect, authorize('admin'), getGlobalDashboard);
router.get('/house/:houseId', protect, authorize('admin'), validateHouseIdParam, getAdminHouseDashboard);
router.get('/house/:houseId/events', protect, authorize('admin'), validateHouseIdParam, getAdminHouseEvents);
router.post('/add-member', protect, authorize('admin', 'mentor'), validateAddMember, addMember);

module.exports = router;
