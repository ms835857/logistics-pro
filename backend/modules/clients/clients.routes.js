const express = require('express');
const router = express.Router();
const clientsController = require('./clients.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.use(protect);
router.use(adminOnly);

router.get('/', clientsController.getAllClients);
router.patch('/:id/deactivate', clientsController.deactivateClient);

module.exports = router;
