
const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    propertyId: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Unavailable'],
      default: 'Available'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Amenity', amenitySchema);
