import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(@CurrentUser() user: any) {
    const userId = user.role === 'admin' ? null : user.id;
    const orders = await this.ordersService.getAllOrders(userId);
    return { data: orders, _skip_format: true };
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @CurrentUser() user: any) {
    const order = await this.ordersService.getOrderById(id);
    if (user.role !== 'admin' && order.user_id !== user.id) {
      throw new ForbiddenException('Access denied: not your resource');
    }
    return { data: order, _skip_format: true };
  }

  @Post()
  async createOrder(@Body() body: CreateOrderDto, @CurrentUser() user: any) {
    const data: any = { ...body };
    data.user_id = user.id;
    
    // Admin manual creation details
    if (user.role === 'admin' && body.manual_user_id) {
      data.user_id = body.manual_user_id;
      data.customer_name = body.manual_customer_name;
      data.customer_email = body.manual_customer_email;
    } else {
      data.customer_name = user.company_name || user.name;
      data.customer_email = user.email;
    }

    const order = await this.ordersService.createOrder(data);
    return { data: order, _skip_format: true };
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    // Only admin can update raw order fields, let's keep consistency with express controller
    const order = await this.ordersService.updateOrder(id, body);
    return { data: order, _skip_format: true };
  }

  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string, @CurrentUser() user: any) {
    const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const order = await this.ordersService.getOrderById(id);
    if (user.role !== 'admin') {
      if (order.user_id !== user.id) {
        throw new ForbiddenException('Access denied: not your resource');
      }
      if (status !== 'cancelled') {
        throw new ForbiddenException('Users can only cancel their orders');
      }
    }

    const updatedOrder = await this.ordersService.updateOrderStatus(id, status);
    return { data: updatedOrder, _skip_format: true };
  }

  @Delete(':id')
  @Roles('admin')
  async deleteOrder(@Param('id') id: string) {
    const order = await this.ordersService.deleteOrder(id);
    return { data: order, _skip_format: true };
  }
}
