import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Check stock for all items first
    for (const item of dto.items) {
      const hasStock = await this.productsService.checkVariantStock(
        item.productId,
        item.color,
        item.size,
        item.quantity,
      );

      if (!hasStock) {
        const variant = await this.productsService.getVariant(
          item.productId,
          item.color,
          item.size,
        );
        throw new BadRequestException(
          `Insufficient stock for ${item.color} ${item.size}. Available: ${variant.stock}`,
        );
      }
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        total: dto.total,
        shippingAddress: dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
        items: {
          create: dto.items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Decrease stock for all items
    for (const item of dto.items) {
      await this.productsService.decreaseVariantStock(
        item.productId,
        item.color,
        item.size,
        item.quantity,
      );
    }

    // Create notification for order placed
    await this.notificationsService.createOrderNotification(
      userId,
      order.id,
      'PENDING'
    );

    return order;
  }

  async findAll(userId?: string, role?: string) {
    const where: any = {};

    // Regular users can only see their own orders
    if (role !== 'ADMIN' && userId) {
      where.userId = userId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId?: string, role?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Regular users can only see their own orders
    if (role !== 'ADMIN' && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUniqueOrThrow({
      where: { id },
    });

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: dto,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create notification if status changed
    if (dto.status && dto.status !== existingOrder.status) {
      await this.notificationsService.createOrderNotification(
        existingOrder.userId,
        id,
        dto.status
      );
    }

    return updatedOrder;
  }

  async delete(id: string) {
    await this.prisma.order.findUniqueOrThrow({
      where: { id },
    });

    return this.prisma.order.delete({
      where: { id },
    });
  }
}





















