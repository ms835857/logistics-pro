import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAllOrders(user: any): Promise<{
        data: any[];
        _skip_format: boolean;
    }>;
    getOrderById(id: string, user: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    createOrder(body: CreateOrderDto, user: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    updateOrder(id: string, body: any, user: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    updateOrderStatus(id: string, status: string, user: any): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
    deleteOrder(id: string): Promise<{
        data: any;
        _skip_format: boolean;
    }>;
}
