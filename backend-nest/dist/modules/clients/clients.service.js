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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pg_1 = require("pg");
const user_schema_1 = require("../users/schemas/user.schema");
const database_module_1 = require("../../database/database.module");
let ClientsService = class ClientsService {
    userModel;
    pgPool;
    constructor(userModel, pgPool) {
        this.userModel = userModel;
        this.pgPool = pgPool;
    }
    async getAllClients() {
        const clients = await this.userModel.find({ role: 'user' }).select('-password').lean();
        const orderCountsResult = await this.pgPool.query('SELECT user_id, COUNT(*) as total_orders FROM orders GROUP BY user_id');
        const orderCountsMap = {};
        orderCountsResult.rows.forEach(row => {
            if (row.user_id) {
                orderCountsMap[row.user_id] = parseInt(row.total_orders);
            }
        });
        const mergedClients = clients.map(client => ({
            id: client._id,
            name: client.name,
            email: client.email,
            company_name: client.company_name,
            company_phone: client.company_phone,
            industry: client.industry,
            is_active: client.is_active,
            createdAt: client.createdAt,
            totalOrders: orderCountsMap[client._id.toString()] || 0
        }));
        return mergedClients;
    }
    async deactivateClient(id) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, { is_active: false }, { new: true }).select('-password');
        if (!updatedUser) {
            throw new common_1.NotFoundException('Client not found');
        }
        return updatedUser;
    }
    async updateClientStatus(id, is_active) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, { is_active }, { new: true }).select('-password');
        if (!updatedUser) {
            throw new common_1.NotFoundException('Client not found');
        }
        return updatedUser;
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, common_1.Inject)(database_module_1.PG_CONNECTION)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        pg_1.Pool])
], ClientsService);
//# sourceMappingURL=clients.service.js.map