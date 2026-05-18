import { Controller, Get, Put, Patch, Delete, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getMyProfile(@CurrentUser() user: any) {
    const result = await this.usersService.getMyProfile(user.id);
    return { ...result.toObject(), _skip_format: true };
  }

  @Put('profile')
  async updateMyProfile(@CurrentUser() user: any, @Body() updateData: any) {
    const result = await this.usersService.updateMyProfile(user.id, updateData);
    return { ...result.toObject(), _skip_format: true };
  }

  @Put('password')
  async updateMyPassword(@CurrentUser() user: any, @Body() body: any) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Both current and new password are required');
    }
    const result = await this.usersService.updateMyPassword(user.id, body.currentPassword, body.newPassword);
    return { ...result, _skip_format: true };
  }

  @Get()
  @Roles('admin')
  async getAllUsers() {
    const result = await this.usersService.getAllUsers();
    // Return array directly to match express output shape for users route
    return Object.assign(result, { _skip_format: true });
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateUserRole(@CurrentUser() user: any, @Param('id') id: string, @Body('role') role: string) {
    const result = await this.usersService.updateUserRole(user.id, id, role);
    return { ...result.toObject(), _skip_format: true };
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@CurrentUser() user: any, @Param('id') id: string) {
    const result = await this.usersService.deleteUser(user.id, id);
    return { ...result, _skip_format: true };
  }
}
