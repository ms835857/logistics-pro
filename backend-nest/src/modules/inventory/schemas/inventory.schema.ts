import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  is_low_stock: boolean;

  @Prop({ default: true })
  is_active: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
