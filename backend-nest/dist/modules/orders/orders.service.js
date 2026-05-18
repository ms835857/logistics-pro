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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const database_module_1 = require("../../database/database.module");
const inventory_service_1 = require("../inventory/inventory.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
let OrdersService = class OrdersService {
    pgPool;
    inventoryService;
    userModel;
    constructor(pgPool, inventoryService, userModel) {
        this.pgPool = pgPool;
        this.inventoryService = inventoryService;
        this.userModel = userModel;
    }
    async getAllOrders(userId) {
        const query = userId ? 'SELECT * FROM orders WHERE user_id = $1' : 'SELECT * FROM orders';
        const params = userId ? [userId] : [];
        const result = await this.pgPool.query(query, params);
        const orders = result.rows;
        if (!userId && orders.length > 0) {
            const userIds = orders.map(o => o.user_id).filter(Boolean);
            const users = await this.userModel
                .find({ _id: { $in: userIds } })
                .select('company_name')
                .lean();
            const map = {};
            users.forEach(u => (map[u._id.toString()] = u.company_name));
            orders.forEach(o => {
                if (o.user_id && map[o.user_id])
                    o.company_name = map[o.user_id];
            });
        }
        return orders;
    }
    async getOrderById(id) {
        const result = await this.pgPool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0)
            throw new common_1.NotFoundException('Order not found');
        return result.rows[0];
    }
    async createOrder(data) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        data.invoice_number = `INV-${dateStr}-${randomNum}`;
        if (!data.product_name || !data.quantity || data.quantity < 1 || !data.delivery_address) {
            throw new common_1.BadRequestException('Missing required fields');
        }
        if (data.manual_user_id) {
            const manualUser = await this.userModel.findById(data.manual_user_id).lean();
            if (!manualUser)
                throw new common_1.BadRequestException('Manual user not found');
            data.user_id = manualUser._id.toString();
            data.customer_name = data.manual_customer_name || manualUser.company_name || manualUser.name;
            data.customer_email = data.manual_customer_email || manualUser.email;
        }
        else {
            const user = await this.userModel.findById(data.user_id).lean();
            data.customer_name = user?.company_name || user?.name;
            data.customer_email = user?.email;
        }
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(',');
        const insertQuery = `INSERT INTO orders (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const insertResult = await this.pgPool.query(insertQuery, values);
        const order = insertResult.rows[0];
        await this.inventoryService.adjustQuantityByProductName(data.product_name, -data.quantity);
        return order;
    }
    async updateOrder(id, data) {
        const order = await this.getOrderById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const query = `UPDATE orders SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const result = await this.pgPool.query(query, [...values, id]);
        return result.rows[0];
    }
    async updateOrderStatus(id, status) {
        const valid = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
        if (!valid.includes(status))
            throw new common_1.BadRequestException('Invalid status');
        const result = await this.pgPool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        if (result.rows.length === 0)
            throw new common_1.NotFoundException('Order not found');
        return result.rows[0];
    }
    async deleteOrder(id) {
        const result = await this.pgPool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0)
            throw new common_1.NotFoundException('Order not found');
        return result.rows[0];
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.PG_CONNECTION)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [pg_1.Pool,
        inventory_service_1.InventoryService,
        mongoose_2.Model])
], OrdersService);
//# sourceMappingURL=orders.service.js.map