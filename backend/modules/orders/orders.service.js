const orderModel = require('./order.model');
const inventoryService = require('../inventory/inventory.service');

const getAllOrders = async () => {
    return await orderModel.findAll();
};

const getOrderById = async (id) => {
    const order = await orderModel.findById(id);
    if (!order) throw new Error('Order not found');
    return order;
};

const createOrder = async (data) => {
    // Create order
    const order = await orderModel.create(data);

    // Automatically reduce quantity_in_stock
    await inventoryService.reduceStockByProductName(data.product_name, data.quantity);

    return order;
};

const updateOrder = async (id, data) => {
    const order = await orderModel.findById(id);
    if (!order) throw new Error('Order not found');
    return await orderModel.update(id, data);
};

const updateOrderStatus = async (id, status) => {
    const order = await orderModel.findById(id);
    if (!order) throw new Error('Order not found');
    return await orderModel.updateStatus(id, status);
};

const deleteOrder = async (id) => {
    const order = await orderModel.findById(id);
    if (!order) throw new Error('Order not found');
    return await orderModel.deleteOrder(id);
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder
};
