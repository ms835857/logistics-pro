const supplierModel = require('./supplier.model');
const ordersService = require('../orders/orders.service');

const getAllSuppliers = async () => {
    return await supplierModel.findAll();
};

const getSupplierById = async (id) => {
    const supplier = await supplierModel.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
};

const getMySuppliers = async (userId) => {
    const orders = await ordersService.getAllOrders(userId);
    const supplierIds = [...new Set(orders.map(o => o.supplier_id).filter(Boolean))];
    if (supplierIds.length === 0) return [];
    return await supplierModel.findByIds(supplierIds);
};

const createSupplier = async (data) => {
    return await supplierModel.create(data);
};

const updateSupplier = async (id, data) => {
    const supplier = await supplierModel.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    return await supplierModel.update(id, data);
};

const deleteSupplier = async (id) => {
    const supplier = await supplierModel.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    return await supplierModel.softDelete(id);
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    getMySuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
