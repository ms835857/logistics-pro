import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAll(): Promise<{
        data: any[];
        _skip_format: boolean;
    }>;
    getOne(id: string): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    create(dto: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    update(id: string, dto: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    delete(id: string): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
}
