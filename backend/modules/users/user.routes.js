const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

// Protected routes (any logged-in user)
router.get('/me', protect, userController.getMyProfile);
router.put('/me', protect, userController.updateMyProfile);
router.put('/me/password', protect, userController.updateMyPassword);

// Admin only routes
router.get('/', protect, adminOnly, userController.getAllUsers);
router.patch('/:id/role', protect, adminOnly, userController.updateUserRole);
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;
