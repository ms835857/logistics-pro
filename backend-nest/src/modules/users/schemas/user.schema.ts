import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: function() { return this.role === 'user'; } })
  company_name?: string;

  @Prop({ required: function() { return this.role === 'user'; } })
  company_address?: string;

  @Prop({ required: function() { return this.role === 'user'; } })
  company_phone?: string;

  @Prop({ enum: ['Retail', 'Manufacturing', 'Healthcare', 'Technology', 'Other'], required: function() { return this.role === 'user'; } })
  industry?: string;

  @Prop()
  tax_id?: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
