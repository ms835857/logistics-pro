import { SuppliersService } from './suppliers.service';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    getAllSuppliers(): Promise<{
        data: any[];
        _skip_format: boolean;
    }>;
    getMySuppliers(user: any): Promise<{
        data: any[];
        _skip_format: boolean;
    }>;
    getSupplierById(id: number): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    createSupplier(body: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    updateSupplier(id: number, body: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    deleteSupplier(id: number): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
}
