import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cartItems;
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check variant stock
    try {
      const hasStock = await this.productsService.checkVariantStock(
        dto.productId,
        dto.color,
        dto.size,
        dto.quantity,
      );

      if (!hasStock) {
        const variant = await this.productsService.getVariant(dto.productId, dto.color, dto.size);
        throw new BadRequestException(
          `Insufficient stock for ${dto.color} ${dto.size}. Available: ${variant.stock}`,
        );
      }
    } catch (error) {
      // If variant not found, allow adding to cart (for backward compatibility)
      // But log the warning
      console.warn(`Variant not found for product ${dto.productId} - ${dto.color} ${dto.size}`);
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId,
          productId: dto.productId,
          size: dto.size,
          color: dto.color,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      
      // Check stock for new quantity
      try {
        const hasStockForUpdate = await this.productsService.checkVariantStock(
          dto.productId,
          dto.color,
          dto.size,
          newQuantity,
        );

        if (!hasStockForUpdate) {
          const variant = await this.productsService.getVariant(dto.productId, dto.color, dto.size);
          throw new BadRequestException(
            `Insufficient stock for ${dto.color} ${dto.size}. Available: ${variant.stock}`,
          );
        }
      } catch (error) {
        // If variant not found, allow update (for backward compatibility)
        console.warn(`Variant not found for product ${dto.productId} - ${dto.color} ${dto.size}`);
      }

      // Update quantity
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
        size: dto.size,
        color: dto.color,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check variant stock for new quantity
    try {
      const hasStock = await this.productsService.checkVariantStock(
        cartItem.productId,
        cartItem.color,
        cartItem.size,
        dto.quantity,
      );

      if (!hasStock) {
        const variant = await this.productsService.getVariant(
          cartItem.productId,
          cartItem.color,
          cartItem.size,
        );
        throw new BadRequestException(
          `Insufficient stock for ${cartItem.color} ${cartItem.size}. Available: ${variant.stock}`,
        );
      }
    } catch (error) {
      // If variant not found, allow update (for backward compatibility)
      console.warn(`Variant not found for product ${cartItem.productId} - ${cartItem.color} ${cartItem.size}`);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async removeFromCart(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  async syncCart(userId: string, items: AddToCartDto[]) {
    // Clear existing cart
    await this.clearCart(userId);

    // Add all items
    if (items.length > 0) {
      for (const item of items) {
        await this.addToCart(userId, item);
      }
    }

    return this.getCart(userId);
  }
}

