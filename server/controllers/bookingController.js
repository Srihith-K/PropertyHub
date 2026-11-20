
const Amenity = require('../models/Amenity');
const AmenityBooking = require('../models/AmenityBooking');

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find()
      .populate('amenityId', 'name propertyId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Create amenity booking
exports.createBooking = async (req, res) => {
  try {
    const {
      amenityId,
      propertyId,
      bookingDate,
      checkInTime,
      checkOutTime
    } = req.body;

    if (
      !amenityId ||
      !propertyId ||
      !bookingDate ||
      !checkInTime ||
      !checkOutTime
    ) {
      return res.status(400).json({
        success: false,
        message: 'All booking fields are required'
      });
    }

    // Validate time format
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      !timePattern.test(checkInTime) ||
      !timePattern.test(checkOutTime) ||
      checkOutTime <= checkInTime
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter valid times. Check-out must be after check-in.'
      });
    }

    // Validate date
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate) ||
      new Date(`${bookingDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== bookingDate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid booking date'
      });
    }

    const amenity = await Amenity.findById(amenityId);

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: 'Amenity not found'
      });
    }

    if (amenity.propertyId !== propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Amenity does not belong to this property'
      });
    }

    if (amenity.availabilityStatus !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'This amenity is currently unavailable'
      });
    }

    // Find bookings for the selected calendar date
    const startOfDay = new Date(`${bookingDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${bookingDate}T23:59:59.999Z`);

    // Check overlapping time slots
    const conflictingBooking = await AmenityBooking.findOne({
      amenityId,
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'Cancelled' },
      checkInTime: { $lt: checkOutTime },
      checkOutTime: { $gt: checkInTime }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Booking conflict! This amenity is already booked during the selected time.'
      });
    }

    const booking = await AmenityBooking.create({
      amenityId,
      propertyId,
      bookingDate: startOfDay,
      checkInTime,
      checkOutTime,
      status: 'Booked'
    });

    res.status(201).json({
      success: true,
      message: 'Amenity booked successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Update booking status for check-in/check-out tracking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'Booked',
      'Checked In',
      'Completed',
      'Cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status'
      });
    }

    const booking = await AmenityBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};
