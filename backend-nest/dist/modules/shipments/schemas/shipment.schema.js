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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentSchema = exports.Shipment = exports.StatusHistoryEntrySchema = exports.StatusHistoryEntry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class StatusHistoryEntry {
    status;
    note;
    updatedBy;
    timestamp;
}
exports.StatusHistoryEntry = StatusHistoryEntry;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StatusHistoryEntry.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StatusHistoryEntry.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StatusHistoryEntry.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], StatusHistoryEntry.prototype, "timestamp", void 0);
exports.StatusHistoryEntrySchema = mongoose_1.SchemaFactory.createForClass(StatusHistoryEntry);
let Shipment = class Shipment {
    orderId;
    trackingNumber;
    status;
    driverName;
    vehicleNumber;
    originAddress;
    destinationAddress;
    estimatedDeliveryDate;
    actualDelivery;
    statusHistory;
};
exports.Shipment = Shipment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Shipment.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Shipment.prototype, "trackingNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'preparing' }),
    __metadata("design:type", String)
], Shipment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "driverName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "vehicleNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "originAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "destinationAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Shipment.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Shipment.prototype, "actualDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.StatusHistoryEntrySchema], default: [] }),
    __metadata("design:type", Array)
], Shipment.prototype, "statusHistory", void 0);
exports.Shipment = Shipment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Shipment);
exports.ShipmentSchema = mongoose_1.SchemaFactory.createForClass(Shipment);
exports.ShipmentSchema.pre('save', function () {
    if (this.isNew && !this.trackingNumber) {
        const randomStr = Math.floor(100000 + Math.random() * 900000).toString();
        this.trackingNumber = `SHIP-${randomStr}`;
    }
});
//# sourceMappingURL=shipment.schema.js.map