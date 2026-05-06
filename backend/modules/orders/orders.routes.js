const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.use(protect);

router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);

router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.patch('/:id/status', ordersController.updateOrderStatus);

router.delete('/:id', adminOnly, ordersController.deleteOrder);

module.exports = router;
