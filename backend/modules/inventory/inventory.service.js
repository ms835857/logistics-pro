const inventoryModel = require('./inventory.model');

const addLowStockFlag = (items) => {
    return items.map(item => ({
        ...item,
        low_stock: item.quantity_in_stock <= item.low_stock_threshold
    }));
};

const getAllInventory = async () => {
    const items = await inventoryModel.findAll();
    return addLowStockFlag(items);
};

const getInventoryById = async (id) => {
    const item = await inventoryModel.findById(id);
    if (!item) throw new Error('Item not found');
    return addLowStockFlag([item])[0];
};

const getLowStockInventory = async () => {
    const items = await inventoryModel.findLowStock();
    return addLowStockFlag(items);
};

const createInventoryItem = async (data) => {
    return await inventoryModel.create(data);
};

const updateInventoryItem = async (id, data) => {
    const item = await inventoryModel.findById(id);
    if (!item) throw new Error('Item not found');
    return await inventoryModel.update(id, data);
};

const updateStock = async (id, quantity_in_stock) => {
    const item = await inventoryModel.findById(id);
    if (!item) throw new Error('Item not found');
    return await inventoryModel.updateStock(id, quantity_in_stock);
};

const deleteInventoryItem = async (id) => {
    const item = await inventoryModel.findById(id);
    if (!item) throw new Error('Item not found');
    return await inventoryModel.deleteItem(id);
};

// Internal service method for orders
const reduceStockByProductName = async (product_name, quantityToReduce) => {
    const item = await inventoryModel.findByProductName(product_name);
    if (item) {
        const newQuantity = item.quantity_in_stock - quantityToReduce;
        await inventoryModel.updateStock(item.id, newQuantity);
    }
}

module.exports = {
    getAllInventory,
    getInventoryById,
    getLowStockInventory,
    createInventoryItem,
    updateInventoryItem,
    updateStock,
    deleteInventoryItem,
    reduceStockByProductName
};
