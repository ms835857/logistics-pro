const supplierModel = require('./supplier.model');

const getAllSuppliers = async () => {
    return await supplierModel.findAll();
};

const getSupplierById = async (id) => {
    const supplier = await supplierModel.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
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
    createSupplier,
    updateSupplier,
    deleteSupplier
};
