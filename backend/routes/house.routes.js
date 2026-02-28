const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getHouseDashboard,
  getAllHouses,
  getHouse,
} = require('../controllers/house.controller');
const { protect } = require('../middleware/auth');

router.get('/', getAllHouses);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/:id', protect, getHouse);
router.get('/:houseId/dashboard', protect, getHouseDashboard);

module.exports = router;
