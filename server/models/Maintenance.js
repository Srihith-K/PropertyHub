
const mongoose = require('mongoose');
const crypto = require('crypto');

const maintenanceSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      default: () => `PH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    },

    propertyId: {
      type: String,
      required: [true, 'Property ID is required'],
      trim: true
    },

    issueDescription: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },

    resolutionDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Maintenance',
  maintenanceSchema
);
