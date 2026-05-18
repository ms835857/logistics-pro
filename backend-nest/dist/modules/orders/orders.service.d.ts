import { Pool } from 'pg';
import { InventoryService } from '../inventory/inventory.service';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
export declare class OrdersService {
    private pgPool;
    private inventoryService;
    private userModel;
    constructor(pgPool: Pool, inventoryService: InventoryService, userModel: Model<UserDocument>);
    getAllOrders(userId: string | null): Promise<any[]>;
    getOrderById(id: string): Promise<any>;
    createOrder(data: any): Promise<any>;
    updateOrder(id: string, data: any): Promise<any>;
    updateOrderStatus(id: string, status: string): Promise<any>;
    deleteOrder(id: string): Promise<any>;
}
