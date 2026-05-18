import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(user: any): Promise<{
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
    updateMyProfile(user: any, updateData: any): Promise<{
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
    updateMyPassword(user: any, body: any): Promise<{
        _skip_format: boolean;
        message: string;
    }>;
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[] & {
        _skip_format: boolean;
    }>;
    updateUserRole(user: any, id: string, role: string): Promise<{
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
    deleteUser(user: any, id: string): Promise<{
        _skip_format: boolean;
        message: string;
    }>;
}
