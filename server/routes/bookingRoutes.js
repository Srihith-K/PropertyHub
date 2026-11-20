const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getBookings,
  createBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

router.use(protect);
router.get('/', getBookings);
router.post('/', authorize('tenant', 'owner'), createBooking);
router.patch('/:id/status', authorize('owner'), updateBookingStatus);

module.exports = router;
