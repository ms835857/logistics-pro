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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const database_module_1 = require("../../database/database.module");
let SuppliersService = class SuppliersService {
    pgPool;
    constructor(pgPool) {
        this.pgPool = pgPool;
    }
    async getAllSuppliers() {
        const result = await this.pgPool.query('SELECT * FROM suppliers ORDER BY id DESC');
        return result.rows;
    }
    async getSupplierById(id) {
        const result = await this.pgPool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
        if (result.rows.length === 0)
            throw new common_1.NotFoundException('Supplier not found');
        return result.rows[0];
    }
    async getMySuppliers(userId) {
        const ordersResult = await this.pgPool.query('SELECT DISTINCT supplier_id FROM orders WHERE user_id = $1 AND supplier_id IS NOT NULL', [userId]);
        const supplierIds = ordersResult.rows.map(r => r.supplier_id);
        if (supplierIds.length === 0)
            return [];
        const params = supplierIds.map((_, i) => `$${i + 1}`).join(',');
        const suppliersResult = await this.pgPool.query(`SELECT * FROM suppliers WHERE id IN (${params}) ORDER BY id DESC`, supplierIds);
        return suppliersResult.rows;
    }
    async createSupplier(data) {
        const { name, contact_person, email, phone, address, country } = data;
        try {
            const result = await this.pgPool.query(`INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [name, contact_person, email, phone, address, country]);
            return result.rows[0];
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.BadRequestException('Supplier email already exists');
            throw error;
        }
    }
    async updateSupplier(id, data) {
        const supplier = await this.getSupplierById(id);
        if (!supplier)
            throw new common_1.NotFoundException('Supplier not found');
        const { name, contact_person, email, phone, address, country, is_active } = data;
        const result = await this.pgPool.query(`UPDATE suppliers SET 
         name = COALESCE($1, name),
         contact_person = COALESCE($2, contact_person),
         email = COALESCE($3, email),
         phone = COALESCE($4, phone),
         address = COALESCE($5, address),
         country = COALESCE($6, country),
         is_active = COALESCE($7, is_active)
         WHERE id = $8 RETURNING *`, [name, contact_person, email, phone, address, country, is_active, id]);
        return result.rows[0];
    }
    async deleteSupplier(id) {
        const supplier = await this.getSupplierById(id);
        if (!supplier)
            throw new common_1.NotFoundException('Supplier not found');
        const result = await this.pgPool.query('UPDATE suppliers SET is_active = false WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.PG_CONNECTION)),
    __metadata("design:paramtypes", [pg_1.Pool])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map