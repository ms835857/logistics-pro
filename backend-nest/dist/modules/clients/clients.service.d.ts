import { Model } from 'mongoose';
import { Pool } from 'pg';
import { User, UserDocument } from '../users/schemas/user.schema';
export declare class ClientsService {
    private userModel;
    private pgPool;
    constructor(userModel: Model<UserDocument>, pgPool: Pool);
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
    }[]>;
    deactivateClient(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateClientStatus(id: string, is_active: boolean): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
