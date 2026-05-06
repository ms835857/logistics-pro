const Shipment = require('./shipment.schema');

const getAllShipments = async () => {
    return await Shipment.find().sort({ createdAt: -1 });
};

const getShipmentById = async (id) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) throw new Error('Shipment not found');
    return shipment;
};

const getShipmentByTrackingNumber = async (trackingNumber) => {
    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) throw new Error('Shipment not found');
    return shipment;
};

const createShipment = async (data) => {
    const shipment = new Shipment(data);
    shipment.statusHistory.push({ status: shipment.status, note: 'Shipment created' });
    await shipment.save();
    return shipment;
};

const updateShipmentStatus = async (id, status, note) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) throw new Error('Shipment not found');

    shipment.status = status;
    shipment.statusHistory.push({ status, note });

    if (status === 'delivered') {
        shipment.actualDelivery = new Date();
    }

    await shipment.save();
    return shipment;
};

const deleteShipment = async (id) => {
    const shipment = await Shipment.findByIdAndDelete(id);
    if (!shipment) throw new Error('Shipment not found');
    return shipment;
};

module.exports = {
    getAllShipments,
    getShipmentById,
    getShipmentByTrackingNumber,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
