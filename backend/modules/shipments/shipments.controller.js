const shipmentsService = require('./shipments.service');
const ordersService = require('../orders/orders.service');
const apiResponse = require('../../utils/apiResponse');

const getAllShipments = async (req, res, next) => {
    try {
        let orderIds = null;
        if (req.user.role !== 'admin') {
            const userOrders = await ordersService.getAllOrders(req.user.id);
            orderIds = userOrders.map(order => order.id.toString());
        }
        
        const shipments = await shipmentsService.getAllShipments(orderIds);
        return apiResponse.success(res, 'Shipments retrieved successfully', shipments);
    } catch (error) {
        next(error);
    }
};

const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentsService.getShipmentById(req.params.id);
        return apiResponse.success(res, 'Shipment retrieved successfully', shipment);
    } catch (error) {
        if (error.message === 'Shipment not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const trackShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentsService.getShipmentByTrackingNumber(req.params.trackingNumber);
        return apiResponse.success(res, 'Shipment tracked successfully', shipment);
    } catch (error) {
        if (error.message === 'Shipment not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const createShipment = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return apiResponse.error(res, 'Order ID is required', null, 400);

        const shipment = await shipmentsService.createShipment(req.body);
        return apiResponse.success(res, 'Shipment created successfully', shipment, 201);
    } catch (error) {
        next(error);
    }
};

const updateShipmentStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;
        if (!status) return apiResponse.error(res, 'Status is required', null, 400);

        const validStatuses = ['preparing', 'in-transit', 'out-for-delivery', 'delivered', 'failed'];
        if (!validStatuses.includes(status)) {
            return apiResponse.error(res, 'Invalid status', null, 400);
        }

        const shipment = await shipmentsService.updateShipmentStatus(req.params.id, status, note || '');
        return apiResponse.success(res, 'Shipment status updated successfully', shipment);
    } catch (error) {
        if (error.message === 'Shipment not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

const deleteShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentsService.deleteShipment(req.params.id);
        return apiResponse.success(res, 'Shipment deleted successfully', shipment);
    } catch (error) {
        if (error.message === 'Shipment not found') return apiResponse.error(res, error.message, null, 404);
        next(error);
    }
};

module.exports = {
    getAllShipments,
    getShipmentById,
    trackShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
