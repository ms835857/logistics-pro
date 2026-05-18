import { Pool } from 'pg';
export declare class InventoryService {
    private pgPool;
    constructor(pgPool: Pool);
    private addLowStockFlag;
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    adjustQuantityByProductName(productName: string, delta: number): Promise<void>;
}
