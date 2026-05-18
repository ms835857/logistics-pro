import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('admin')
  async getAll() {
    const items = await this.inventoryService.findAll();
    return { data: items, _skip_format: true };
  }

  @Get(':id')
  @Roles('admin')
  async getOne(@Param('id') id: string) {
    const item = await this.inventoryService.findById(id);
    return { data: item, _skip_format: true };
  }

  @Post()
  @Roles('admin')
  async create(@Body() dto: any) {
    const item = await this.inventoryService.create(dto);
    return { data: item, _skip_format: true };
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: any) {
    const item = await this.inventoryService.update(id, dto);
    return { data: item, _skip_format: true };
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    const item = await this.inventoryService.delete(id);
    return { data: item, _skip_format: true };
  }
}
