const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getHouseDashboard,
  getAllHouses,
  getHouse,
  getTopPerformers,
  addPointsToStudent,
} = require('../controllers/house.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateMongoId, validateHouseIdParam } = require('../middleware/validate');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');

router.get('/', getAllHouses);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/top-performers', getTopPerformers);
router.get('/:id', protect, validateMongoId, getHouse);
router.get('/:houseId/dashboard', protect, validateHouseIdParam, getHouseDashboard);

// Add points to a student (teamlead/mentor only)
router.post(
  '/add-points',
  protect,
  authorize('teamlead', 'mentor'),
  [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('points').isInt({ min: 1, max: 1000 }).withMessage('Points must be between 1 and 1000'),
    body('reason').trim().notEmpty().withMessage('Reason is required').isLength({ max: 500 }).withMessage('Reason too long'),
    body('type').optional().isIn(['bonus', 'penalty']).withMessage('Type must be bonus or penalty'),
  ],
  handleValidationErrors,
  addPointsToStudent
);

module.exports = router;
