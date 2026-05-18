import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShipmentDocument = Shipment & Document;

export class StatusHistoryEntry {
  @Prop({ required: true })
  status: string;

  @Prop()
  note?: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const StatusHistoryEntrySchema = SchemaFactory.createForClass(StatusHistoryEntry);

@Schema({ timestamps: true })
export class Shipment {
  @Prop({ type: Types.ObjectId, required: true })
  orderId: Types.ObjectId;

  @Prop({ unique: true })
  trackingNumber: string;

  @Prop({ required: true, default: 'preparing' })
  status: string;

  @Prop()
  driverName?: string;

  @Prop()
  vehicleNumber?: string;

  @Prop()
  originAddress?: string;

  @Prop()
  destinationAddress?: string;

  @Prop()
  estimatedDeliveryDate?: Date;

  @Prop()
  actualDelivery?: Date;

  @Prop({ type: [StatusHistoryEntrySchema], default: [] })
  statusHistory: StatusHistoryEntry[];
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);

// Auto-generate tracking number before saving to match Express behavior
ShipmentSchema.pre('save', function (this: any) {
  if (this.isNew && !this.trackingNumber) {
    const randomStr = Math.floor(100000 + Math.random() * 900000).toString();
    this.trackingNumber = `SHIP-${randomStr}`;
  }
});
