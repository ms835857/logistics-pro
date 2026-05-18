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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getAllOrders(user) {
        const userId = user.role === 'admin' ? null : user.id;
        const orders = await this.ordersService.getAllOrders(userId);
        return { data: orders, _skip_format: true };
    }
    async getOrderById(id, user) {
        const order = await this.ordersService.getOrderById(id);
        if (user.role !== 'admin' && order.user_id !== user.id) {
            throw new common_1.ForbiddenException('Access denied: not your resource');
        }
        return { data: order, _skip_format: true };
    }
    async createOrder(body, user) {
        const data = { ...body };
        data.user_id = user.id;
        if (user.role === 'admin' && body.manual_user_id) {
            data.user_id = body.manual_user_id;
            data.customer_name = body.manual_customer_name;
            data.customer_email = body.manual_customer_email;
        }
        else {
            data.customer_name = user.company_name || user.name;
            data.customer_email = user.email;
        }
        const order = await this.ordersService.createOrder(data);
        return { data: order, _skip_format: true };
    }
    async updateOrder(id, body, user) {
        const order = await this.ordersService.updateOrder(id, body);
        return { data: order, _skip_format: true };
    }
    async updateOrderStatus(id, status, user) {
        const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Invalid status value');
        }
        const order = await this.ordersService.getOrderById(id);
        if (user.role !== 'admin') {
            if (order.user_id !== user.id) {
                throw new common_1.ForbiddenException('Access denied: not your resource');
            }
            if (status !== 'cancelled') {
                throw new common_1.ForbiddenException('Users can only cancel their orders');
            }
        }
        const updatedOrder = await this.ordersService.updateOrderStatus(id, status);
        return { data: updatedOrder, _skip_format: true };
    }
    async deleteOrder(id) {
        const order = await this.ordersService.deleteOrder(id);
        return { data: order, _skip_format: true };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deleteOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map