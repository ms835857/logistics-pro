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
exports.ShipmentsController = void 0;
const common_1 = require("@nestjs/common");
const shipments_service_1 = require("./shipments.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const orders_service_1 = require("../orders/orders.service");
let ShipmentsController = class ShipmentsController {
    shipmentsService;
    ordersService;
    constructor(shipmentsService, ordersService) {
        this.shipmentsService = shipmentsService;
        this.ordersService = ordersService;
    }
    async getAll(user) {
        const orderIds = user.role !== 'admin' ? await this.getUserOrderIds(user.id) : undefined;
        const shipments = await this.shipmentsService.getAllShipments(orderIds);
        return { data: shipments, _skip_format: true };
    }
    async getUserOrderIds(userId) {
        const orders = await this.ordersService.getAllOrders(userId);
        return orders.map((order) => order.id.toString());
    }
    async getOne(id) {
        const shipment = await this.shipmentsService.getShipmentById(id);
        return { data: shipment, _skip_format: true };
    }
    async track(trackingNumber) {
        const shipment = await this.shipmentsService.getShipmentByTrackingNumber(trackingNumber);
        return { data: shipment, _skip_format: true };
    }
    async create(dto, user) {
        const shipment = await this.shipmentsService.createShipment(dto, user.name || user.id);
        return { data: shipment, _skip_format: true };
    }
    async updateStatus(id, status, note, user) {
        const shipment = await this.shipmentsService.updateShipmentStatus(id, status, note, user.name || user.id);
        return { data: shipment, _skip_format: true };
    }
    async delete(id) {
        const shipment = await this.shipmentsService.deleteShipment(id);
        return { data: shipment, _skip_format: true };
    }
};
exports.ShipmentsController = ShipmentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)('track/:trackingNumber'),
    __param(0, (0, common_1.Param)('trackingNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "track", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('note')),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShipmentsController.prototype, "delete", null);
exports.ShipmentsController = ShipmentsController = __decorate([
    (0, common_1.Controller)('shipments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [shipments_service_1.ShipmentsService,
        orders_service_1.OrdersService])
], ShipmentsController);
//# sourceMappingURL=shipments.controller.js.map