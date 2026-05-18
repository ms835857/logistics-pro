const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
    status: String,
    note: String,
    updatedBy: String,
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const shipmentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    trackingNumber: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['preparing', 'in-transit', 'out-for-delivery', 'delivered', 'failed'],
        default: 'preparing'
    },
    driverName: String,
    vehicleNumber: String,
    originAddress: String,
    destinationAddress: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    statusHistory: [statusHistorySchema]
}, {
    timestamps: true
});

// Auto-generate tracking number before saving
shipmentSchema.pre('save', async function () {
    if (this.isNew && !this.trackingNumber) {
        const randomStr = Math.floor(100000 + Math.random() * 900000).toString();
        this.trackingNumber = `SHIP-${randomStr}`;
    }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
