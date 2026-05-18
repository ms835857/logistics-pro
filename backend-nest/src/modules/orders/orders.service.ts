import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { InventoryService } from '../inventory/inventory.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(PG_CONNECTION) private pgPool: Pool,
    private inventoryService: InventoryService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Fetch orders. If `userId` is null => admin (fetch all). Otherwise fetch only that user's orders.
   * Performs manual cross‑database merge to attach `company_name`.
   */
  async getAllOrders(userId: string | null) {
    const query = userId ? 'SELECT * FROM orders WHERE user_id = $1' : 'SELECT * FROM orders';
    const params = userId ? [userId] : [];
    const result = await this.pgPool.query(query, params);
    const orders = result.rows;

    // Admin merge with MongoDB user company_name
    if (!userId && orders.length > 0) {
      const userIds = orders.map(o => o.user_id).filter(Boolean);
      const users = await this.userModel
        .find({ _id: { $in: userIds } })
        .select('company_name')
        .lean();
      const map: Record<string, string> = {};
      users.forEach(u => (map[u._id.toString()] = (u as any).company_name));
      orders.forEach(o => {
        if (o.user_id && map[o.user_id]) o.company_name = map[o.user_id];
      });
    }
    return orders;
  }

  async getOrderById(id: string) {
    const result = await this.pgPool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundException('Order not found');
    return result.rows[0];
  }

  /**
   * Create an order. Handles invoice generation, customer info fallback, and stock reduction.
   */
  async createOrder(data: any) {
    // Generate invoice
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    data.invoice_number = `INV-${dateStr}-${randomNum}`;

    // Ensure required fields
    if (!data.product_name || !data.quantity || data.quantity < 1 || !data.delivery_address) {
      throw new BadRequestException('Missing required fields');
    }

    // If admin supplied manual_user_id, override user info
    if (data.manual_user_id) {
      const manualUser = await this.userModel.findById(data.manual_user_id).lean();
      if (!manualUser) throw new BadRequestException('Manual user not found');
      data.user_id = manualUser._id.toString();
      data.customer_name = data.manual_customer_name || manualUser.company_name || manualUser.name;
      data.customer_email = data.manual_customer_email || manualUser.email;
    } else {
      // client: data.user_id already set by controller (from JWT)
      const user = await this.userModel.findById(data.user_id).lean();
      data.customer_name = user?.company_name || user?.name;
      data.customer_email = user?.email;
    }

    // Insert order
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(',');
    const insertQuery = `INSERT INTO orders (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const insertResult = await this.pgPool.query(insertQuery, values);
    const order = insertResult.rows[0];

    // Reduce inventory stock
    await this.inventoryService.adjustQuantityByProductName(data.product_name, -data.quantity);

    return order;
  }

  async updateOrder(id: string, data: any) {
    const order = await this.getOrderById(id);
    if (!order) throw new NotFoundException('Order not found');
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE orders SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await this.pgPool.query(query, [...values, id]);
    return result.rows[0];
  }

  async updateOrderStatus(id: string, status: string) {
    const valid = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if (!valid.includes(status)) throw new BadRequestException('Invalid status');
    const result = await this.pgPool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id],
    );
    if (result.rows.length === 0) throw new NotFoundException('Order not found');
    return result.rows[0];
  }

  async deleteOrder(id: string) {
    const result = await this.pgPool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) throw new NotFoundException('Order not found');
    return result.rows[0];
  }
}
