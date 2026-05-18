import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { OrdersService } from '../orders/orders.service';

@Controller('shipments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShipmentsController {
  constructor(
    private readonly shipmentsService: ShipmentsService,
    private readonly ordersService: OrdersService,
  ) {}

  /** GET /shipments – admin sees all, client sees only theirs */
  @Get()
  async getAll(@CurrentUser() user: any) {
    const orderIds = user.role !== 'admin' ? await this.getUserOrderIds(user.id) : undefined;
    const shipments = await this.shipmentsService.getAllShipments(orderIds);
    return { data: shipments, _skip_format: true };
  }

  private async getUserOrderIds(userId: string): Promise<string[]> {
    const orders = await this.ordersService.getAllOrders(userId);
    return orders.map((order: any) => order.id.toString());
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const shipment = await this.shipmentsService.getShipmentById(id);
    return { data: shipment, _skip_format: true };
  }

  @Get('track/:trackingNumber')
  async track(@Param('trackingNumber') trackingNumber: string) {
    const shipment = await this.shipmentsService.getShipmentByTrackingNumber(trackingNumber);
    return { data: shipment, _skip_format: true };
  }

  @Post()
  async create(@Body() dto: any, @CurrentUser() user: any) {
    const shipment = await this.shipmentsService.createShipment(dto, user.name || user.id);
    return { data: shipment, _skip_format: true };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('note') note: string, @CurrentUser() user: any) {
    const shipment = await this.shipmentsService.updateShipmentStatus(id, status, note, user.name || user.id);
    return { data: shipment, _skip_format: true };
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    const shipment = await this.shipmentsService.deleteShipment(id);
    return { data: shipment, _skip_format: true };
  }
}
