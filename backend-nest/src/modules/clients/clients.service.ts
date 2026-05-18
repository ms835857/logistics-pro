import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pool } from 'pg';
import { User, UserDocument } from '../users/schemas/user.schema';
import { PG_CONNECTION } from '../../database/database.module';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(PG_CONNECTION) private pgPool: Pool,
  ) {}

  async getAllClients() {
    // Fetch all client users from MongoDB
    const clients = await this.userModel.find({ role: 'user' }).select('-password').lean();
    
    // Fetch order counts from PostgreSQL
    const orderCountsResult = await this.pgPool.query('SELECT user_id, COUNT(*) as total_orders FROM orders GROUP BY user_id');
    const orderCountsMap = {};
    
    orderCountsResult.rows.forEach(row => {
        if (row.user_id) {
            orderCountsMap[row.user_id] = parseInt(row.total_orders);
        }
    });

    // Cross-database merge
    const mergedClients = clients.map(client => ({
        id: client._id,
        name: client.name,
        email: client.email,
        company_name: client.company_name,
        company_phone: client.company_phone,
        industry: client.industry,
        is_active: client.is_active,
        createdAt: (client as any).createdAt,
        totalOrders: orderCountsMap[client._id.toString()] || 0
    }));

    return mergedClients;
  }

  async deactivateClient(id: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
    ).select('-password');

    if (!updatedUser) {
        throw new NotFoundException('Client not found');
    }

    return updatedUser;
  }

  async updateClientStatus(id: string, is_active: boolean) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { is_active },
        { new: true }
    ).select('-password');

    if (!updatedUser) {
        throw new NotFoundException('Client not found');
    }

    return updatedUser;
  }
}
