import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles('admin')
  async getAdminDashboard() {
    const metrics = await this.dashboardService.getAdminDashboard();
    return { data: metrics, _skip_format: true };
  }

  @Get('client')
  async getClientDashboard(@CurrentUser() user: any) {
    const metrics = await this.dashboardService.getClientDashboard(user.id);
    return { data: metrics, _skip_format: true };
  }
}
