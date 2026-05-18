import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(): Promise<{
        data: {
            activeShipments: number;
            pendingOrders: number;
            lowStockItems: number;
            totalClients: number;
            totalRevenue: number;
        };
        _skip_format: boolean;
    }>;
    getClientDashboard(user: any): Promise<{
        data: {
            totalOrders: number;
            totalSpend: any;
            activeShipments: number;
            deliveredShipments: number;
        };
        _skip_format: boolean;
    }>;
}
