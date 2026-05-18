import { IsNotEmpty, IsNumber, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  total_price: number;

  @IsString()
  @IsNotEmpty()
  delivery_address: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsOptional()
  supplier_id?: number;

  // admin‑only fields (optional for clients)
  @IsString()
  @IsOptional()
  manual_user_id?: string;

  @IsString()
  @IsOptional()
  manual_customer_name?: string;

  @IsString()
  @IsOptional()
  manual_customer_email?: string;
}
