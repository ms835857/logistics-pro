import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getMyProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMyProfile(userId: string, updateData: any) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updateMyPassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new Error('Incorrect current password');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  async updateUserRole(adminId: string, userId: string, role: string) {
    if (adminId === userId) {
      throw new Error('Cannot change your own role');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async deleteUser(adminId: string, userId: string) {
    if (adminId === userId) {
      throw new Error('Cannot delete your own account');
    }
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
