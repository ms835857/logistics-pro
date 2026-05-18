import { Model, Types } from 'mongoose';
import { Shipment, ShipmentDocument } from './schemas/shipment.schema';
export declare class ShipmentsService {
    private shipmentModel;
    constructor(shipmentModel: Model<ShipmentDocument>);
    getAllShipments(orderIds?: string[]): Promise<(Shipment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getShipmentById(id: string): Promise<Shipment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createShipment(data: any, updatedBy: string): Promise<Shipment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateShipmentStatus(id: string, status: string, note: string | undefined, updatedBy: string): Promise<Shipment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteShipment(id: string): Promise<Shipment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
