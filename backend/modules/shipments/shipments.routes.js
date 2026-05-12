const express = require('express');
const router = express.Router();
const shipmentsController = require('./shipments.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

// Public route
router.get('/track/:trackingNumber', shipmentsController.trackShipment);

// Protected routes
router.use(protect);

router.get('/', shipmentsController.getAllShipments);
router.get('/:id', adminOnly, shipmentsController.getShipmentById);

router.post('/', adminOnly, shipmentsController.createShipment);
router.patch('/:id/status', adminOnly, shipmentsController.updateShipmentStatus);

router.delete('/:id', adminOnly, shipmentsController.deleteShipment);

module.exports = router;
