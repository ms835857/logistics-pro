import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';

@Injectable()
export class InventoryService {
  constructor(@Inject(PG_CONNECTION) private pgPool: Pool) {}

  private addLowStockFlag(items: any[]) {
    return items.map(item => ({
      ...item,
      low_stock: parseInt(item.quantity_in_stock) <= parseInt(item.low_stock_threshold)
    }));
  }

  async findAll() {
    const result = await this.pgPool.query('SELECT * FROM inventory ORDER BY id DESC');
    return this.addLowStockFlag(result.rows);
  }

  async findById(id: string) {
    const result = await this.pgPool.query('SELECT * FROM inventory WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundException('Item not found');
    return this.addLowStockFlag([result.rows[0]])[0];
  }

  async create(data: any) {
    const { product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold } = data;
    const result = await this.pgPool.query(
      `INSERT INTO inventory (product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold]
    );
    return result.rows[0];
  }

  async update(id: string, data: any) {
    const item = await this.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    const { product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold } = data;
    const result = await this.pgPool.query(
      `UPDATE inventory SET 
       product_name = COALESCE($1, product_name),
       sku = COALESCE($2, sku),
       quantity_in_stock = COALESCE($3, quantity_in_stock),
       unit_price = COALESCE($4, unit_price),
       warehouse_location = COALESCE($5, warehouse_location),
       supplier_id = COALESCE($6, supplier_id),
       low_stock_threshold = COALESCE($7, low_stock_threshold)
       WHERE id = $8 RETURNING *`,
      [product_name, sku, quantity_in_stock, unit_price, warehouse_location, supplier_id, low_stock_threshold, id]
    );
    return result.rows[0];
  }

  async delete(id: string) {
    const item = await this.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    const result = await this.pgPool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  async adjustQuantityByProductName(productName: string, delta: number) {
    const result = await this.pgPool.query('SELECT * FROM inventory WHERE product_name = $1', [productName]);
    const item = result.rows[0];
    if (item) {
      const newQuantity = parseInt(item.quantity_in_stock) + delta;
      if (newQuantity < 0) throw new BadRequestException('Insufficient stock');
      await this.pgPool.query(
        'UPDATE inventory SET quantity_in_stock = $1 WHERE id = $2',
        [newQuantity, item.id]
      );
    }
  }
}
