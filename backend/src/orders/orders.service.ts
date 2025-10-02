import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.order.create({
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
    await this.prisma.order.findUniqueOrThrow({
      where: { id },
    });

    return this.prisma.order.update({
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





















