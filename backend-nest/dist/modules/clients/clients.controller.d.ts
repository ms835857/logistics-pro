import { ClientsService } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    getAllClients(): Promise<{
        id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        company_name: string | undefined;
        company_phone: string | undefined;
        industry: string | undefined;
        is_active: boolean;
        createdAt: any;
        totalOrders: any;
    }[] & {
        _skip_format: boolean;
    }>;
    updateClientStatus(id: string, is_active: boolean): Promise<{
        _skip_format: boolean;
        name: string;
        email: string;
        password: string;
        company_name?: string;
        company_address?: string;
        company_phone?: string;
        industry?: string;
        tax_id?: string;
        is_active: boolean;
        role: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
}
