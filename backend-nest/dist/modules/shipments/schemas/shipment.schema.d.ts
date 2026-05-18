import { Document, Types } from 'mongoose';
export type ShipmentDocument = Shipment & Document;
export declare class StatusHistoryEntry {
    status: string;
    note?: string;
    updatedBy: string;
    timestamp: Date;
}
export declare const StatusHistoryEntrySchema: import("mongoose").Schema<StatusHistoryEntry, import("mongoose").Model<StatusHistoryEntry, any, any, any, any, any, StatusHistoryEntry>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StatusHistoryEntry, Document<unknown, {}, StatusHistoryEntry, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StatusHistoryEntry & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    status?: import("mongoose").SchemaDefinitionProperty<string, StatusHistoryEntry, Document<unknown, {}, StatusHistoryEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StatusHistoryEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, StatusHistoryEntry, Document<unknown, {}, StatusHistoryEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StatusHistoryEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedBy?: import("mongoose").SchemaDefinitionProperty<string, StatusHistoryEntry, Document<unknown, {}, StatusHistoryEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StatusHistoryEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timestamp?: import("mongoose").SchemaDefinitionProperty<Date, StatusHistoryEntry, Document<unknown, {}, StatusHistoryEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StatusHistoryEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StatusHistoryEntry>;
export declare class Shipment {
    orderId: Types.ObjectId;
    trackingNumber: string;
    status: string;
    driverName?: string;
    vehicleNumber?: string;
    originAddress?: string;
    destinationAddress?: string;
    estimatedDeliveryDate?: Date;
    actualDelivery?: Date;
    statusHistory: StatusHistoryEntry[];
}
export declare const ShipmentSchema: import("mongoose").Schema<Shipment, import("mongoose").Model<Shipment, any, any, any, any, any, Shipment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shipment, Document<unknown, {}, Shipment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    orderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trackingNumber?: import("mongoose").SchemaDefinitionProperty<string, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    driverName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    vehicleNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    originAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    destinationAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    estimatedDeliveryDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    actualDelivery?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    statusHistory?: import("mongoose").SchemaDefinitionProperty<StatusHistoryEntry[], Shipment, Document<unknown, {}, Shipment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shipment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Shipment>;
