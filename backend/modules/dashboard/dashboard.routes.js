const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.use(protect);

router.get('/admin', adminOnly, dashboardController.getAdminDashboard);
router.get('/client', dashboardController.getClientDashboard);

module.exports = router;
