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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pg_1 = require("pg");
const database_module_1 = require("../../database/database.module");
const shipment_schema_1 = require("../shipments/schemas/shipment.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const orders_service_1 = require("../orders/orders.service");
let DashboardService = class DashboardService {
    pgPool;
    shipmentModel;
    userModel;
    ordersService;
    constructor(pgPool, shipmentModel, userModel, ordersService) {
        this.pgPool = pgPool;
        this.shipmentModel = shipmentModel;
        this.userModel = userModel;
        this.ordersService = ordersService;
    }
    async getAdminDashboard() {
        const activeShipments = await this.shipmentModel.countDocuments({
            status: { $nin: ['delivered', 'failed'] },
        });
        const pendingOrdersResult = await this.pgPool.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
        const pendingOrders = parseInt(pendingOrdersResult.rows[0].count);
        const lowStockResult = await this.pgPool.query("SELECT COUNT(*) FROM inventory WHERE quantity_in_stock <= low_stock_threshold");
        const lowStockItems = parseInt(lowStockResult.rows[0].count);
        const totalClients = await this.userModel.countDocuments({
            role: 'user',
            is_active: true,
        });
        const revenueResult = await this.pgPool.query("SELECT SUM(total_price) as total FROM orders WHERE status = 'delivered'");
        const totalRevenue = parseFloat(revenueResult.rows[0].total || 0);
        return {
            activeShipments,
            pendingOrders,
            lowStockItems,
            totalClients,
            totalRevenue,
        };
    }
    async getClientDashboard(userId) {
        const orders = await this.ordersService.getAllOrders(userId);
        const orderIds = orders.map(o => o.id.toString());
        const totalOrders = orders.length;
        const totalSpend = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
        const activeShipments = orderIds.length > 0
            ? await this.shipmentModel.countDocuments({
                orderId: { $in: orderIds },
                status: { $nin: ['delivered', 'failed'] },
            })
            : 0;
        const deliveredShipments = orderIds.length > 0
            ? await this.shipmentModel.countDocuments({
                orderId: { $in: orderIds },
                status: 'delivered',
            })
            : 0;
        return {
            totalOrders,
            totalSpend,
            activeShipments,
            deliveredShipments,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.PG_CONNECTION)),
    __param(1, (0, mongoose_1.InjectModel)(shipment_schema_1.Shipment.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [pg_1.Pool,
        mongoose_2.Model,
        mongoose_2.Model,
        orders_service_1.OrdersService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map