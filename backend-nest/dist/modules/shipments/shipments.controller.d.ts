import { ShipmentsService } from './shipments.service';
import { OrdersService } from '../orders/orders.service';
export declare class ShipmentsController {
    private readonly shipmentsService;
    private readonly ordersService;
    constructor(shipmentsService: ShipmentsService, ordersService: OrdersService);
    getAll(user: any): Promise<{
        data: (import("./schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        _skip_format: boolean;
    }>;
    private getUserOrderIds;
    getOne(id: string): Promise<{
        data: import("./schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        _skip_format: boolean;
    }>;
    track(trackingNumber: string): Promise<{
        data: import("./schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        _skip_format: boolean;
    }>;
    create(dto: any, user: any): Promise<{
        data: import("./schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        _skip_format: boolean;
    }>;
    updateStatus(id: string, status: string, note: string, user: any): Promise<{
        data: import("./schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        _skip_format: boolean;
    }>;
    delete(id: string): Promise<{
        data: import("./schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        _skip_format: boolean;
    }>;
}
