
const Amenity = require('../models/Amenity');

// Get all amenities
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: amenities.length,
      amenities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch amenities',
      error: error.message
    });
  }
};

// Create amenity
exports.createAmenity = async (req, res) => {
  try {
    const { name, propertyId, description } = req.body;

    if (!name || !propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Amenity name and Property ID are required'
      });
    }

    const amenity = await Amenity.create({
      name,
      propertyId,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Amenity created successfully',
      amenity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create amenity',
      error: error.message
    });
  }
};

// Update amenity availability
exports.updateAmenityAvailability = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;

    if (!['Available', 'Unavailable'].includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      });
    }

    const amenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus },
      { new: true, runValidators: true }
    );

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: 'Amenity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Amenity availability updated',
      amenity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update amenity',
      error: error.message
    });
  }
};
