import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Shipment, ShipmentDocument } from '../shipments/schemas/shipment.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PG_CONNECTION) private pgPool: Pool,
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private ordersService: OrdersService,
  ) {}

  async getAdminDashboard() {
    // 1. Active Shipments
    const activeShipments = await this.shipmentModel.countDocuments({
      status: { $nin: ['delivered', 'failed'] },
    });

    // 2. Pending Orders
    const pendingOrdersResult = await this.pgPool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'pending'"
    );
    const pendingOrders = parseInt(pendingOrdersResult.rows[0].count);

    // 3. Low Stock Items
    const lowStockResult = await this.pgPool.query(
      "SELECT COUNT(*) FROM inventory WHERE quantity_in_stock <= low_stock_threshold"
    );
    const lowStockItems = parseInt(lowStockResult.rows[0].count);

    // 4. Total Active Clients
    const totalClients = await this.userModel.countDocuments({
      role: 'user',
      is_active: true,
    });

    // 5. Total Revenue (delivered orders)
    const revenueResult = await this.pgPool.query(
      "SELECT SUM(total_price) as total FROM orders WHERE status = 'delivered'"
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].total || 0);

    return {
      activeShipments,
      pendingOrders,
      lowStockItems,
      totalClients,
      totalRevenue,
    };
  }

  async getClientDashboard(userId: string) {
    // 1. Fetch client orders
    const orders = await this.ordersService.getAllOrders(userId);
    const orderIds = orders.map(o => o.id.toString());

    // 2. Total Orders
    const totalOrders = orders.length;

    // 3. Total Spend
    const totalSpend = orders.reduce(
      (sum, order) => sum + parseFloat(order.total_price || 0),
      0
    );

    // 4. Active Shipments
    const activeShipments =
      orderIds.length > 0
        ? await this.shipmentModel.countDocuments({
            orderId: { $in: orderIds },
            status: { $nin: ['delivered', 'failed'] },
          })
        : 0;

    // 5. Delivered Shipments
    const deliveredShipments =
      orderIds.length > 0
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
}
