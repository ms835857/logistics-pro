import { Pool } from 'pg';
export declare class SuppliersService {
    private pgPool;
    constructor(pgPool: Pool);
    getAllSuppliers(): Promise<any[]>;
    getSupplierById(id: number): Promise<any>;
    getMySuppliers(userId: string): Promise<any[]>;
    createSupplier(data: any): Promise<any>;
    updateSupplier(id: number, data: any): Promise<any>;
    deleteSupplier(id: number): Promise<any>;
}
