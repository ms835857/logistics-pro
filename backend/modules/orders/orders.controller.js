const ordersService = require('./orders.service');
const apiResponse = require('../../utils/apiResponse');

const getAllOrders = async (req, res, next) => {
    try {
        const userId = req.user.role === 'admin' ? null : req.user.id;
        const orders = await ordersService.getAllOrders(userId);
        return apiResponse.success(res, 'Orders retrieved successfully', orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await ordersService.getOrderById(req.params.id);
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return apiResponse.error(res, 'Access denied: not your resource', null, 403);
        }
        return apiResponse.success(res, 'Order retrieved successfully', order);
    } catch (error) {
        if (error.message === 'Order not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const { product_name, quantity, total_price, delivery_address, notes, supplier_id } = req.body;
        
        // Basic validation
        if (!product_name || !quantity || quantity < 1 || !delivery_address) {
            return apiResponse.error(res, 'Validation failed: Missing product_name, quantity, or delivery_address', null, 400);
        }

        // Auto-generate invoice number
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        req.body.invoice_number = `INV-${dateStr}-${randomNum}`;

        // Set customer info from req.user
        req.body.user_id = req.user.id;
        
        let customerName = req.user.company_name || req.user.name;
        let customerEmail = req.user.email;

        // Fallback: If name is missing (old token), fetch from MongoDB
        if (!customerName) {
            const User = require('../../models/user.schema');
            const fullUser = await User.findById(req.user.id).lean();
            if (fullUser) {
                customerName = fullUser.company_name || fullUser.name;
                customerEmail = fullUser.email;
            }
        }

        req.body.customer_name = customerName;
        req.body.customer_email = customerEmail;
        req.body.status = 'pending';

        if (req.user.role === 'admin' && req.body.manual_user_id) {
            req.body.user_id = req.body.manual_user_id;
            req.body.customer_name = req.body.manual_customer_name;
            req.body.customer_email = req.body.manual_customer_email;
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

        const order = await ordersService.getOrderById(req.params.id);
        if (req.user.role !== 'admin') {
            if (order.user_id !== req.user.id) {
                return apiResponse.error(res, 'Access denied: not your resource', null, 403);
            }
            if (status !== 'cancelled') {
                return apiResponse.error(res, 'Users can only cancel their orders', null, 403);
            }
        }

        const updatedOrder = await ordersService.updateOrderStatus(req.params.id, status);
        return apiResponse.success(res, 'Order status updated successfully', updatedOrder);
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
