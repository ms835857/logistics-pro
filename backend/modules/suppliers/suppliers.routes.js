const express = require('express');
const router = express.Router();
const suppliersController = require('./suppliers.controller');
const { protect } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.use(protect);

router.get('/', suppliersController.getAllSuppliers);
router.get('/my-suppliers', suppliersController.getMySuppliers);
router.get('/:id', suppliersController.getSupplierById);

router.post('/', adminOnly, suppliersController.createSupplier);
router.put('/:id', adminOnly, suppliersController.updateSupplier);
router.delete('/:id', adminOnly, suppliersController.deleteSupplier);

module.exports = router;
