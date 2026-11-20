const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceStatus
} = require('../controllers/maintenanceController');

router.use(protect);
router.get('/', getMaintenanceRequests);
router.post('/', authorize('tenant', 'owner'), createMaintenanceRequest);
router.patch('/:id/status', authorize('owner'), updateMaintenanceStatus);

module.exports = router;
