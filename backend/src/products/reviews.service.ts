import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async canUserReview(productId: string, userId: string): Promise<{ 
    canReview: boolean; 
    reason?: string; 
    deliveredOrders?: Array<{ id: string; createdAt: Date; hasReview: boolean }>;
  }> {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { canReview: false, reason: 'Sản phẩm không tồn tại' };
    }

    // Get all delivered orders that contain this product
    const deliveredOrders = await this.prisma.order.findMany({
      where: {
        userId,
        status: 'DELIVERED',
        items: {
          some: {
            productId,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (deliveredOrders.length === 0) {
      return { canReview: false, reason: 'Bạn chỉ có thể đánh giá sản phẩm từ đơn hàng đã giao' };
    }

    // Check which orders already have reviews
    const ordersWithReviewStatus = await Promise.all(
      deliveredOrders.map(async (order) => {
        const existingReview = await this.prisma.review.findUnique({
          where: {
            orderId_productId: {
              orderId: order.id,
              productId,
            },
          },
        });
        return {
          id: order.id,
          createdAt: order.createdAt,
          hasReview: !!existingReview,
        };
      })
    );

    return { 
      canReview: true, 
      deliveredOrders: ordersWithReviewStatus,
    };
  }

  async create(productId: string, userId: string, dto: CreateReviewDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify order exists, is delivered, belongs to user, and contains the product
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        userId,
        status: 'DELIVERED',
        items: {
          some: {
            productId,
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found or not eligible for review');
    }

    // Check if review already exists for this order+product combination
    const existingReview = await this.prisma.review.findUnique({
      where: {
        orderId_productId: {
          orderId: dto.orderId,
          productId,
        },
      },
    });

    let review;

    if (existingReview) {
      // Update existing review
      review = await this.prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: dto.rating,
          comment: dto.comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } else {
      // Create new review
      review = await this.prisma.review.create({
        data: {
          productId,
          userId,
          orderId: dto.orderId,
          rating: dto.rating,
          comment: dto.comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    // Update product rating
    await this.updateProductRating(productId);

    return review;
  }

  async delete(id: string, userId: string, role: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only allow user to delete their own review or admin can delete any
    if (review.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const productId = review.productId;

    await this.prisma.review.delete({
      where: { id },
    });

    // Update product rating after deletion
    await this.updateProductRating(productId);
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: totalReviews,
      },
    });
  }
}


