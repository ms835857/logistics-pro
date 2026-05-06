const inventoryService = require('./inventory.service');
const apiResponse = require('../../utils/apiResponse');

const getAllInventory = async (req, res, next) => {
    try {
        const items = await inventoryService.getAllInventory();
        return apiResponse.success(res, 'Inventory retrieved successfully', items);
    } catch (error) {
        next(error);
    }
};

const getLowStockInventory = async (req, res, next) => {
    try {
        const items = await inventoryService.getLowStockInventory();
        return apiResponse.success(res, 'Low stock items retrieved successfully', items);
    } catch (error) {
        next(error);
    }
};

const getInventoryById = async (req, res, next) => {
    try {
        const item = await inventoryService.getInventoryById(req.params.id);
        return apiResponse.success(res, 'Item retrieved successfully', item);
    } catch (error) {
        if (error.message === 'Item not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const createInventoryItem = async (req, res, next) => {
    try {
        const { product_name } = req.body;
        if (!product_name) return apiResponse.error(res, 'Product name is required', null, 400);

        const item = await inventoryService.createInventoryItem(req.body);
        return apiResponse.success(res, 'Item created successfully', item, 201);
    } catch (error) {
        if (error.code === '23505') return apiResponse.error(res, 'Product name or SKU already exists', null, 400);
        next(error);
    }
};

const updateInventoryItem = async (req, res, next) => {
    try {
        const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
        return apiResponse.success(res, 'Item updated successfully', item);
    } catch (error) {
        if (error.message === 'Item not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const updateStock = async (req, res, next) => {
    try {
        const { quantity_in_stock } = req.body;
        if (quantity_in_stock === undefined) return apiResponse.error(res, 'quantity_in_stock is required', null, 400);

        const item = await inventoryService.updateStock(req.params.id, quantity_in_stock);
        return apiResponse.success(res, 'Stock updated successfully', item);
    } catch (error) {
        if (error.message === 'Item not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const deleteInventoryItem = async (req, res, next) => {
    try {
        const item = await inventoryService.deleteInventoryItem(req.params.id);
        return apiResponse.success(res, 'Item deleted successfully', item);
    } catch (error) {
        if (error.message === 'Item not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

module.exports = {
    getAllInventory,
    getLowStockInventory,
    getInventoryById,
    createInventoryItem,
    updateInventoryItem,
    updateStock,
    deleteInventoryItem
};
