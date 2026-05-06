const ordersService = require('./orders.service');
const apiResponse = require('../../utils/apiResponse');

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await ordersService.getAllOrders();
        return apiResponse.success(res, 'Orders retrieved successfully', orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await ordersService.getOrderById(req.params.id);
        return apiResponse.success(res, 'Order retrieved successfully', order);
    } catch (error) {
        if (error.message === 'Order not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const { customer_name, product_name, quantity, total_price } = req.body;
        if (!customer_name || customer_name.length < 2 || !product_name || !quantity || quantity < 1 || !total_price || total_price < 0) {
            return apiResponse.error(res, 'Validation failed: Invalid order details', null, 400);
        }

        const order = await ordersService.createOrder(req.body);
        return apiResponse.success(res, 'Order created successfully', order, 201);
    } catch (error) {
        next(error);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const order = await ordersService.updateOrder(req.params.id, req.body);
        return apiResponse.success(res, 'Order updated successfully', order);
    } catch (error) {
        if (error.message === 'Order not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return apiResponse.error(res, 'Invalid status value', null, 400);
        }

        const order = await ordersService.updateOrderStatus(req.params.id, status);
        return apiResponse.success(res, 'Order status updated successfully', order);
    } catch (error) {
        if (error.message === 'Order not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const order = await ordersService.deleteOrder(req.params.id);
        return apiResponse.success(res, 'Order deleted successfully', order);
    } catch (error) {
        if (error.message === 'Order not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder
};
