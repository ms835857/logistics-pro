import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shipment, ShipmentDocument } from './schemas/shipment.schema';

@Injectable()
export class ShipmentsService {
  constructor(@InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>) {}

  async getAllShipments(orderIds?: string[]) {
    if (orderIds && orderIds.length > 0) {
      const objectIds = orderIds.map(id => new Types.ObjectId(id));
      return this.shipmentModel.find({ orderId: { $in: objectIds } }).sort({ createdAt: -1 }).lean();
    }
    return this.shipmentModel.find().sort({ createdAt: -1 }).lean();
  }

  async getShipmentById(id: string) {
    const shipment = await this.shipmentModel.findById(id).lean();
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  async getShipmentByTrackingNumber(trackingNumber: string) {
    const shipment = await this.shipmentModel.findOne({ trackingNumber }).lean();
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  async createShipment(data: any, updatedBy: string) {
    const created = new this.shipmentModel({ ...data, statusHistory: [] });
    // push initial status entry
    created.statusHistory.push({
      status: created.status,
      note: 'Shipment created',
      updatedBy,
      timestamp: new Date(),
    } as any);
    await created.save();
    return created.toObject();
  }

  async updateShipmentStatus(id: string, status: string, note: string = '', updatedBy: string) {
    const validStatuses = ['preparing', 'in-transit', 'out-for-delivery', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) throw new BadRequestException('Invalid status');

    const shipment = await this.shipmentModel.findById(id);
    if (!shipment) throw new NotFoundException('Shipment not found');

    shipment.status = status;
    shipment.statusHistory.push({
      status,
      note,
      updatedBy,
      timestamp: new Date(),
    } as any);

    if (status === 'delivered') {
      shipment.actualDelivery = new Date();
    }

    await shipment.save();
    return shipment.toObject();
  }

  async deleteShipment(id: string) {
    const shipment = await this.shipmentModel.findByIdAndDelete(id);
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment.toObject();
  }
}
