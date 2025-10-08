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
    limit?: number;
  }) {
    try {
      // Build where clause only if filters exist
      let where: any = undefined;
      
      if (filters && Object.keys(filters).length > 0) {
        where = {};
        
        if (filters.category) {
          where.category = { slug: filters.category };
        }

        if (filters.search) {
          where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ];
        }

        if (filters.featured !== undefined) {
          where.featured = filters.featured;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          where.price = {};
          if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
          if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
        }
      }

      let orderBy: any = { id: 'desc' };
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

      const results = await this.prisma.product.findMany({
        where: where || {}, // Use empty object if no filters
        include: {
          category: true,
          variants: true,
        },
        orderBy,
        ...(filters?.limit && { take: filters.limit }),
      });

      return results;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
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
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async create(data: CreateProductDto) {
    const { variants, ...productData } = data;
    
    return this.prisma.product.create({
      data: {
        ...productData,
        variants: variants ? {
          create: variants,
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id); // Check if exists

    // Extract categoryId and variants to avoid TypeScript error
    const { categoryId, variants, ...updateData } = data;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        variants: true,
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

  // Variant management methods
  async getVariants(productId: string) {
    await this.findOne(productId); // Check if product exists
    
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: [{ color: 'asc' }, { size: 'asc' }],
    });
  }

  async getVariant(productId: string, color: string, size: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        productId_color_size: {
          productId,
          color,
          size,
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant not found for color: ${color}, size: ${size}`);
    }

    return variant;
  }

  async addVariant(productId: string, data: { color: string; size: string; stock: number; sku?: string }) {
    await this.findOne(productId); // Check if product exists

    return this.prisma.productVariant.create({
      data: {
        productId,
        ...data,
      },
    });
  }

  async updateVariantStock(productId: string, color: string, size: string, stock: number) {
    const variant = await this.getVariant(productId, color, size);

    return this.prisma.productVariant.update({
      where: { id: variant.id },
      data: { stock },
    });
  }

  async deleteVariant(productId: string, color: string, size: string) {
    const variant = await this.getVariant(productId, color, size);

    return this.prisma.productVariant.delete({
      where: { id: variant.id },
    });
  }

  async checkVariantStock(productId: string, color: string, size: string, quantity: number): Promise<boolean> {
    try {
      const variant = await this.getVariant(productId, color, size);
      return variant.stock >= quantity;
    } catch {
      return false;
    }
  }

  async decreaseVariantStock(productId: string, color: string, size: string, quantity: number) {
    const variant = await this.getVariant(productId, color, size);

    if (variant.stock < quantity) {
      throw new Error(`Insufficient stock for ${color} ${size}. Available: ${variant.stock}, Requested: ${quantity}`);
    }

    return this.prisma.productVariant.update({
      where: { id: variant.id },
      data: {
        stock: variant.stock - quantity,
      },
    });
  }
}







