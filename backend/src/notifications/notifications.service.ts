import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    title: string;
    message: string;
    type?: NotificationType;
    orderId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId,
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.ORDER,
        orderId: data.orderId,
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  async deleteAll(userId: string) {
    return this.prisma.notification.deleteMany({
      where: { userId },
    });
  }

  // Helper method to create order notifications
  async createOrderNotification(userId: string, orderId: string, status: string) {
    const statusMessages = {
      PENDING: {
        title: 'Đơn hàng đã được đặt thành công',
        message: 'Đơn hàng của bạn đã được đặt thành công và đang chờ xử lý.',
      },
      PROCESSING: {
        title: 'Đơn hàng đang được xử lý',
        message: 'Đơn hàng của bạn đang được chuẩn bị và sẽ được giao trong thời gian sớm nhất.',
      },
      SHIPPED: {
        title: 'Đơn hàng đã được giao',
        message: 'Đơn hàng của bạn đã được giao và đang trên đường đến với bạn.',
      },
      DELIVERED: {
        title: 'Đơn hàng đã được giao thành công',
        message: 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm!',
      },
      CANCELLED: {
        title: 'Đơn hàng đã bị hủy',
        message: 'Đơn hàng của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.',
      },
    };

    const notificationData = statusMessages[status];
    if (notificationData) {
      return this.create(userId, {
        title: notificationData.title,
        message: notificationData.message,
        type: NotificationType.ORDER,
        orderId,
      });
    }
  }
}
