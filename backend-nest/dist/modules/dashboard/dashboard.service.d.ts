import { Model } from 'mongoose';
import { Pool } from 'pg';
import { ShipmentDocument } from '../shipments/schemas/shipment.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { OrdersService } from '../orders/orders.service';
export declare class DashboardService {
    private pgPool;
    private shipmentModel;
    private userModel;
    private ordersService;
    constructor(pgPool: Pool, shipmentModel: Model<ShipmentDocument>, userModel: Model<UserDocument>, ordersService: OrdersService);
    getAdminDashboard(): Promise<{
        activeShipments: number;
        pendingOrders: number;
        lowStockItems: number;
        totalClients: number;
        totalRevenue: number;
    }>;
    getClientDashboard(userId: string): Promise<{
        totalOrders: number;
        totalSpend: any;
        activeShipments: number;
        deliveredShipments: number;
    }>;
}
