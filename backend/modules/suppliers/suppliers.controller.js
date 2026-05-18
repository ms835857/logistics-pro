const suppliersService = require('./suppliers.service');
const apiResponse = require('../../utils/apiResponse');

const getAllSuppliers = async (req, res, next) => {
    try {
        const suppliers = await suppliersService.getAllSuppliers();
        return apiResponse.success(res, 'Suppliers retrieved successfully', suppliers);
    } catch (error) {
        next(error);
    }
};

const getMySuppliers = async (req, res, next) => {
    try {
        const suppliers = await suppliersService.getMySuppliers(req.user.id);
        return apiResponse.success(res, 'My suppliers retrieved successfully', suppliers);
    } catch (error) {
        next(error);
    }
};

const getSupplierById = async (req, res, next) => {
    try {
        const supplier = await suppliersService.getSupplierById(req.params.id);
        return apiResponse.success(res, 'Supplier retrieved successfully', supplier);
    } catch (error) {
        if (error.message === 'Supplier not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const createSupplier = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) return apiResponse.error(res, 'Supplier name is required', null, 400);
        
        const supplier = await suppliersService.createSupplier(req.body);
        return apiResponse.success(res, 'Supplier created successfully', supplier, 201);
    } catch (error) {
        if (error.code === '23505') return apiResponse.error(res, 'Supplier email already exists', null, 400);
        next(error);
    }
};

const updateSupplier = async (req, res, next) => {
    try {
        const supplier = await suppliersService.updateSupplier(req.params.id, req.body);
        return apiResponse.success(res, 'Supplier updated successfully', supplier);
    } catch (error) {
        if (error.message === 'Supplier not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await suppliersService.deleteSupplier(req.params.id);
        return apiResponse.success(res, 'Supplier deactivated successfully', supplier);
    } catch (error) {
        if (error.message === 'Supplier not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

module.exports = {
    getAllSuppliers,
    getMySuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
