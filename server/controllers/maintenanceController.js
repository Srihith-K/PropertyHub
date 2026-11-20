
const Maintenance = require('../models/Maintenance');

// GET all maintenance requests
exports.getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance requests',
      error: error.message
    });
  }
};

// CREATE maintenance request
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { propertyId, issueDescription } = req.body;

    if (!propertyId || !issueDescription) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and issue description are required'
      });
    }

    const request = await Maintenance.create({
      propertyId,
      issueDescription,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance request',
      error: error.message
    });
  }
};

// UPDATE maintenance status
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'Pending',
      'In Progress',
      'Completed'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maintenance status'
      });
    }

    const request = await Maintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    request.status = status;

    request.resolutionDate =
      status === 'Completed' ? new Date() : null;

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance status updated successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance status',
      error: error.message
    });
  }
};
