const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAmenities,
  createAmenity,
  updateAmenityAvailability
} = require('../controllers/amenityController');

router.use(protect);
router.get('/', getAmenities);
router.post('/', authorize('owner'), createAmenity);
router.patch('/:id/availability', authorize('owner'), updateAmenityAvailability);

module.exports = router;
