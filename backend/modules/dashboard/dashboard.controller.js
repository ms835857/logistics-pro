const apiResponse = require('../../utils/apiResponse');
const Shipment = require('../shipments/shipment.schema');
const User = require('../../models/user.schema');
const db = require('../../config/db.postgres');
const ordersService = require('../orders/orders.service');

const getAdminDashboard = async (req, res, next) => {
    try {
        // Active Shipments
        const activeShipments = await Shipment.countDocuments({ status: { $nin: ['delivered', 'failed'] } });
        
        // Pending Orders
        const pendingOrdersResult = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
        const pendingOrders = parseInt(pendingOrdersResult.rows[0].count);

        // Low Stock Items
        const lowStockResult = await db.query("SELECT COUNT(*) FROM inventory WHERE quantity_in_stock <= low_stock_threshold");
        const lowStockItems = parseInt(lowStockResult.rows[0].count);

        // Total Active Clients
        const totalClients = await User.countDocuments({ role: 'user', is_active: true });

        // Total Revenue (delivered orders)
        const revenueResult = await db.query("SELECT SUM(total_price) as total FROM orders WHERE status = 'delivered'");
        const totalRevenue = parseFloat(revenueResult.rows[0].total || 0);

        return apiResponse.success(res, 'Admin dashboard metrics retrieved successfully', {
            activeShipments,
            pendingOrders,
            lowStockItems,
            totalClients,
            totalRevenue
        });
    } catch (error) {
        next(error);
    }
};

const getClientDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Fetch client orders
        const orders = await ordersService.getAllOrders(userId);
        const orderIds = orders.map(o => o.id.toString());

        // Total Orders
        const totalOrders = orders.length;

        // Total Spend
        const totalSpend = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);

        // Active Shipments
        const activeShipments = await Shipment.countDocuments({ 
            orderId: { $in: orderIds },
            status: { $nin: ['delivered', 'failed'] } 
        });

        // Delivered Shipments
        const deliveredShipments = await Shipment.countDocuments({ 
            orderId: { $in: orderIds },
            status: 'delivered'
        });

        return apiResponse.success(res, 'Client dashboard metrics retrieved successfully', {
            totalOrders,
            totalSpend,
            activeShipments,
            deliveredShipments
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminDashboard,
    getClientDashboard
};
