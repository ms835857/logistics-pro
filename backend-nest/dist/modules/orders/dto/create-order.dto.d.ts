export declare class CreateOrderDto {
    product_name: string;
    quantity: number;
    total_price: number;
    delivery_address: string;
    notes?: string;
    supplier_id?: number;
    manual_user_id?: string;
    manual_customer_name?: string;
    manual_customer_email?: string;
}
