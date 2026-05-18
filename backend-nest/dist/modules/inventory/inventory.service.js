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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const database_module_1 = require("../../database/database.module");
let InventoryService = class InventoryService {
    pgPool;
    constructor(pgPool) {
        this.pgPool = pgPool;
    }
    addLowStockFlag(items) {
        return items.map(item => ({
            ...item,
            low_stock: parseInt(item.quantity_in_stock) <= parseInt(item.low_stock_threshold)
        }));
    }
    async findAll() {
        const result = await this.pgPool.query('SELECT * FROM inventory ORDER BY id DESC');
        return this.addLowStockFlag(result.rows);
    }
    async findById(id) {
        const result = await this.pgPool.query('SELECT * FROM inventory WHERE id = $1', [id]);
        if (result.rows.length === 0)
            throw new common_1.NotFoundException('Item not found');
        return this.addLowStockFlag([result.rows[0]])[0];
    }
    async create(data) {
        const { product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold } = data;
        const result = await this.pgPool.query(`INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold]);
        return result.rows[0];
    }
    async update(id, data) {
        const item = await this.findById(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const { product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold } = data;
        const result = await this.pgPool.query(`UPDATE inventory SET 
       product_name = COALESCE($1, product_name),
       sku = COALESCE($2, sku),
       quantity_in_stock = COALESCE($3, quantity_in_stock),
       unit_price = COALESCE($4, unit_price),
       warehouse_location = COALESCE($5, warehouse_location),
       supplier_id = COALESCE($6, supplier_id),
       low_stock_threshold = COALESCE($7, low_stock_threshold)
       WHERE id = $8 RETURNING *`, [product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold, id]);
        return result.rows[0];
    }
    async delete(id) {
        const item = await this.findById(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const result = await this.pgPool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
    async adjustQuantityByProductName(productName, delta) {
        const result = await this.pgPool.query('SELECT * FROM inventory WHERE product_name = $1', [productName]);
        const item = result.rows[0];
        if (item) {
            const newQuantity = parseInt(item.quantity_in_stock) + delta;
            if (newQuantity < 0)
                throw new common_1.BadRequestException('Insufficient stock');
            await this.pgPool.query('UPDATE inventory SET quantity_in_stock = $1 WHERE id = $2', [newQuantity, item.id]);
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.PG_CONNECTION)),
    __metadata("design:paramtypes", [pg_1.Pool])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map