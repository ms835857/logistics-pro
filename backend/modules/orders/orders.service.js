const orderModel = require('./order.model');
const inventoryService = require('../inventory/inventory.service');
const User = require('../../models/user.schema');

const getAllOrders = async (userId = null) => {
    const orders = await orderModel.findAll(userId);
    
    // Admin fetches all orders -> merge company_name from MongoDB
    if (!userId && orders.length > 0) {
        const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];
        const users = await User.find({ _id: { $in: userIds } }).select('company_name').lean();
        const userMap = {};
        users.forEach(u => userMap[u._id.toString()] = u.company_name);
        
        orders.forEach(o => {
            if (o.user_id && userMap[o.user_id]) {
                o.company_name = userMap[o.user_id];
            }
        });
    }

    return orders;
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
