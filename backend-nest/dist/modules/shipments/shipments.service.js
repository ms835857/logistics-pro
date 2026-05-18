"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shipment_schema_1 = require("./schemas/shipment.schema");
let ShipmentsService = class ShipmentsService {
    shipmentModel;
    constructor(shipmentModel) {
        this.shipmentModel = shipmentModel;
    }
    async getAllShipments(orderIds) {
        if (orderIds && orderIds.length > 0) {
            const objectIds = orderIds.map(id => new mongoose_2.Types.ObjectId(id));
            return this.shipmentModel.find({ orderId: { $in: objectIds } }).sort({ createdAt: -1 }).lean();
        }
        return this.shipmentModel.find().sort({ createdAt: -1 }).lean();
    }
    async getShipmentById(id) {
        const shipment = await this.shipmentModel.findById(id).lean();
        if (!shipment)
            throw new common_1.NotFoundException('Shipment not found');
        return shipment;
    }
    async getShipmentByTrackingNumber(trackingNumber) {
        const shipment = await this.shipmentModel.findOne({ trackingNumber }).lean();
        if (!shipment)
            throw new common_1.NotFoundException('Shipment not found');
        return shipment;
    }
    async createShipment(data, updatedBy) {
        const created = new this.shipmentModel({ ...data, statusHistory: [] });
        created.statusHistory.push({
            status: created.status,
            note: 'Shipment created',
            updatedBy,
            timestamp: new Date(),
        });
        await created.save();
        return created.toObject();
    }
    async updateShipmentStatus(id, status, note = '', updatedBy) {
        const validStatuses = ['preparing', 'in-transit', 'out-for-delivery', 'delivered', 'failed'];
        if (!validStatuses.includes(status))
            throw new common_1.BadRequestException('Invalid status');
        const shipment = await this.shipmentModel.findById(id);
        if (!shipment)
            throw new common_1.NotFoundException('Shipment not found');
        shipment.status = status;
        shipment.statusHistory.push({
            status,
            note,
            updatedBy,
            timestamp: new Date(),
        });
        if (status === 'delivered') {
            shipment.actualDelivery = new Date();
        }
        await shipment.save();
        return shipment.toObject();
    }
    async deleteShipment(id) {
        const shipment = await this.shipmentModel.findByIdAndDelete(id);
        if (!shipment)
            throw new common_1.NotFoundException('Shipment not found');
        return shipment.toObject();
    }
};
exports.ShipmentsService = ShipmentsService;
exports.ShipmentsService = ShipmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shipment_schema_1.Shipment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShipmentsService);
//# sourceMappingURL=shipments.service.js.map