import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles('admin')
  async getAllClients() {
    const clients = await this.clientsService.getAllClients();
    return Object.assign(clients, { _skip_format: true });
  }

  @Patch(':id/status')
  @Roles('admin')
  async updateClientStatus(@Param('id') id: string, @Body('is_active') is_active: boolean) {
    const client = await this.clientsService.updateClientStatus(id, is_active);
    return { ...client.toObject(), _skip_format: true };
  }
}
