import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @Roles('admin')
  async getAllSuppliers() {
    const suppliers = await this.suppliersService.getAllSuppliers();
    return { data: suppliers, _skip_format: true };
  }

  @Get('my-suppliers')
  async getMySuppliers(@CurrentUser() user: any) {
    const suppliers = await this.suppliersService.getMySuppliers(user.id);
    return { data: suppliers, _skip_format: true };
  }

  @Get(':id')
  @Roles('admin')
  async getSupplierById(@Param('id', ParseIntPipe) id: number) {
    const supplier = await this.suppliersService.getSupplierById(id);
    return { data: supplier, _skip_format: true };
  }

  @Post()
  @Roles('admin')
  async createSupplier(@Body() body: any) {
    const supplier = await this.suppliersService.createSupplier(body);
    return { data: supplier, _skip_format: true };
  }

  @Patch(':id')
  @Roles('admin')
  async updateSupplier(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const supplier = await this.suppliersService.updateSupplier(id, body);
    return { data: supplier, _skip_format: true };
  }

  @Delete(':id')
  @Roles('admin')
  async deleteSupplier(@Param('id', ParseIntPipe) id: number) {
    const supplier = await this.suppliersService.deleteSupplier(id);
    return { data: supplier, _skip_format: true };
  }
}
