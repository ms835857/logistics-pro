import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';

@Injectable()
export class SuppliersService {
  constructor(@Inject(PG_CONNECTION) private pgPool: Pool) {}

  async getAllSuppliers() {
    const result = await this.pgPool.query('SELECT * FROM suppliers ORDER BY id DESC');
    return result.rows;
  }

  async getSupplierById(id: number) {
    const result = await this.pgPool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundException('Supplier not found');
    return result.rows[0];
  }

  async getMySuppliers(userId: string) {
    // Instead of depending on OrdersService, just do a clean SQL query to get supplier IDs
    const ordersResult = await this.pgPool.query(
        'SELECT DISTINCT supplier_id FROM orders WHERE user_id = $1 AND supplier_id IS NOT NULL',
        [userId]
    );
    
    const supplierIds = ordersResult.rows.map(r => r.supplier_id);
    if (supplierIds.length === 0) return [];
    
    const params = supplierIds.map((_, i) => `$${i + 1}`).join(',');
    const suppliersResult = await this.pgPool.query(
        `SELECT * FROM suppliers WHERE id IN (${params}) ORDER BY id DESC`,
        supplierIds
    );
    
    return suppliersResult.rows;
  }

  async createSupplier(data: any) {
    const { name, contact_person, email, phone, address, country } = data;
    try {
        const result = await this.pgPool.query(
            `INSERT INTO suppliers (name, contact_person, email, phone, address, country) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, contact_person, email, phone, address, country]
        );
        return result.rows[0];
    } catch (error: any) {
        if (error.code === '23505') throw new BadRequestException('Supplier email already exists');
        throw error;
    }
  }

  async updateSupplier(id: number, data: any) {
    const supplier = await this.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    
    const { name, contact_person, email, phone, address, country, is_active } = data;
    const result = await this.pgPool.query(
        `UPDATE suppliers SET 
         name = COALESCE($1, name),
         contact_person = COALESCE($2, contact_person),
         email = COALESCE($3, email),
         phone = COALESCE($4, phone),
         address = COALESCE($5, address),
         country = COALESCE($6, country),
         is_active = COALESCE($7, is_active)
         WHERE id = $8 RETURNING *`,
        [name, contact_person, email, phone, address, country, is_active, id]
    );
    return result.rows[0];
  }

  async deleteSupplier(id: number) {
    const supplier = await this.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    
    const result = await this.pgPool.query(
        'UPDATE suppliers SET is_active = false WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
  }
}
