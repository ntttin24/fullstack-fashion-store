import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    category?: string;
    search?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name';
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = { slug: filters.category };
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'rating':
          orderBy = { rating: 'desc' };
          break;
        case 'name':
          orderBy = { name: 'asc' };
          break;
      }
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...data,
        colors: data.colors || [],
        sizes: data.sizes || [],
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    });
  }
}







