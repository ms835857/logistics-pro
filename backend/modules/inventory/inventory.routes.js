const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.use(protect);

router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', inventoryController.getLowStockInventory);
router.get('/:id', inventoryController.getInventoryById);

router.post('/', adminOnly, inventoryController.createInventoryItem);
router.put('/:id', adminOnly, inventoryController.updateInventoryItem);
router.patch('/:id/stock', inventoryController.updateStock);
router.delete('/:id', adminOnly, inventoryController.deleteInventoryItem);

module.exports = router;
