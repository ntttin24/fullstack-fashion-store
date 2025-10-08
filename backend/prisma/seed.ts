import { PrismaClient, Category } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to create variants
function createVariants(colors: string[], sizes: string[], stockPerVariant: number = 10) {
  const variants: { color: string; size: string; stock: number }[] = [];
  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        color,
        size,
        stock: stockPerVariant,
      });
    }
  }
  return variants;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fashionstore.com' },
    update: {},
    create: {
      email: 'admin@fashionstore.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create categories
  const categories = [
    { name: 'Áo Nam', slug: 'ao-nam' },
    { name: 'Áo Nữ', slug: 'ao-nu' },
    { name: 'Quần Nam', slug: 'quan-nam' },
    { name: 'Quần Nữ', slug: 'quan-nu' },
    { name: 'Giày Dép', slug: 'giay-dep' },
    { name: 'Phụ Kiện', slug: 'phu-kien' },
  ];

  const createdCategories: Category[] = [];
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
    console.log('✅ Created category:', category.name);
  }

  // Get categories
  const aoNamCategory = createdCategories.find(c => c.slug === 'ao-nam');
  const aoNuCategory = createdCategories.find(c => c.slug === 'ao-nu');
  const quanNamCategory = createdCategories.find(c => c.slug === 'quan-nam');
  const quanNuCategory = createdCategories.find(c => c.slug === 'quan-nu');
  const giayDepCategory = createdCategories.find(c => c.slug === 'giay-dep');
  const phuKienCategory = createdCategories.find(c => c.slug === 'phu-kien');

  let totalProducts = 0;

  // ===== ÁO NAM =====
  if (aoNamCategory) {
    const products = [
      {
        name: 'Áo Thun Basic Nam',
        slug: 'ao-thun-basic-nam',
        description: 'Áo thun nam form regular, chất liệu cotton 100% thấm hút mồ hôi tốt',
        price: 199000,
        originalPrice: 299000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.5,
        reviewCount: 25,
        variants: createVariants(['Trắng', 'Đen', 'Xám'], ['S', 'M', 'L', 'XL'], 10),
      },
      {
        name: 'Áo Sơ Mi Trắng Nam',
        slug: 'ao-somi-trang-nam',
        description: 'Áo sơ mi nam dài tay, phù hợp đi làm và dự tiệc',
        price: 399000,
        originalPrice: 599000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.8,
        reviewCount: 45,
        variants: createVariants(['Trắng', 'Xanh nhạt', 'Hồng'], ['M', 'L', 'XL', 'XXL'], 8),
      },
      {
        name: 'Áo Polo Nam',
        slug: 'ao-polo-nam',
        description: 'Áo polo nam có cổ, phong cách thể thao lịch sự',
        price: 249000,
        originalPrice: 349000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.6,
        reviewCount: 30,
        variants: createVariants(['Đen', 'Navy', 'Đỏ đô'], ['S', 'M', 'L', 'XL'], 12),
      },
      {
        name: 'Áo Khoác Jean Nam',
        slug: 'ao-khoac-jean-nam',
        description: 'Áo khoác jean nam phong cách streetwear',
        price: 549000,
        originalPrice: 799000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.7,
        reviewCount: 20,
        variants: createVariants(['Xanh đậm', 'Đen'], ['M', 'L', 'XL'], 7),
      },
      {
        name: 'Áo Hoodie Nam',
        slug: 'ao-hoodie-nam',
        description: 'Áo hoodie nam có mũ, ấm áp thoải mái',
        price: 459000,
        originalPrice: 649000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.4,
        reviewCount: 18,
        variants: createVariants(['Đen', 'Xám', 'Navy'], ['M', 'L', 'XL', 'XXL'], 9),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: aoNamCategory.id,
          variants: {
            create: product.variants,
          },
        },
      });
      totalProducts++;
    }
    console.log(`✅ Created ${products.length} products for Áo Nam`);
  }

  // ===== ÁO NỮ =====
  if (aoNuCategory) {
    const products = [
      {
        name: 'Áo Croptop Nữ',
        slug: 'ao-croptop-nu',
        description: 'Áo croptop nữ phong cách trẻ trung, năng động',
        price: 159000,
        originalPrice: 249000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.3,
        reviewCount: 32,
        variants: createVariants(['Đen', 'Trắng', 'Hồng'], ['S', 'M', 'L'], 15),
      },
      {
        name: 'Váy Maxi Nữ',
        slug: 'vay-maxi-nu',
        description: 'Váy maxi dài thanh lịch, thích hợp dự tiệc',
        price: 599000,
        originalPrice: 899000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.7,
        reviewCount: 18,
        variants: createVariants(['Đỏ', 'Đen', 'Navy'], ['S', 'M', 'L'], 6),
      },
      {
        name: 'Áo Kiểu Nữ',
        slug: 'ao-kieu-nu',
        description: 'Áo kiểu nữ công sở sang trọng',
        price: 349000,
        originalPrice: 499000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.5,
        reviewCount: 28,
        variants: createVariants(['Trắng', 'Hồng pastel', 'Xanh mint'], ['S', 'M', 'L', 'XL'], 10),
      },
      {
        name: 'Áo Sơ Mi Nữ',
        slug: 'ao-somi-nu',
        description: 'Áo sơ mi nữ dài tay, form dáng thanh lịch',
        price: 379000,
        originalPrice: 549000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.6,
        reviewCount: 24,
        variants: createVariants(['Trắng', 'Đen', 'Xanh navy'], ['S', 'M', 'L'], 11),
      },
      {
        name: 'Áo Len Nữ',
        slug: 'ao-len-nu',
        description: 'Áo len nữ ấm áp, phù hợp mùa đông',
        price: 429000,
        originalPrice: 599000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.8,
        reviewCount: 15,
        variants: createVariants(['Be', 'Nâu', 'Đen'], ['S', 'M', 'L'], 8),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: aoNuCategory.id,
          variants: {
            create: product.variants,
          },
        },
      });
      totalProducts++;
    }
    console.log(`✅ Created ${products.length} products for Áo Nữ`);
  }

  // ===== QUẦN NAM =====
  if (quanNamCategory) {
    const products = [
      {
        name: 'Quần Jean Nam Slimfit',
        slug: 'quan-jean-nam-slimfit',
        description: 'Quần jean nam form slimfit ôm vừa vặn',
        price: 449000,
        originalPrice: 649000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.6,
        reviewCount: 35,
        variants: createVariants(['Xanh đen', 'Xanh nhạt'], ['29', '30', '31', '32', '33'], 8),
      },
      {
        name: 'Quần Kaki Nam',
        slug: 'quan-kaki-nam',
        description: 'Quần kaki nam công sở lịch sự',
        price: 359000,
        originalPrice: 499000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.4,
        reviewCount: 22,
        variants: createVariants(['Be', 'Xám', 'Đen'], ['29', '30', '31', '32'], 10),
      },
      {
        name: 'Quần Short Nam',
        slug: 'quan-short-nam',
        description: 'Quần short nam thể thao thoải mái',
        price: 229000,
        originalPrice: 329000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.3,
        reviewCount: 18,
        variants: createVariants(['Đen', 'Xám', 'Navy'], ['M', 'L', 'XL'], 15),
      },
      {
        name: 'Quần Tây Nam',
        slug: 'quan-tay-nam',
        description: 'Quần tây nam công sở cao cấp',
        price: 499000,
        originalPrice: 699000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.7,
        reviewCount: 28,
        variants: createVariants(['Đen', 'Xám đậm', 'Navy'], ['29', '30', '31', '32', '33'], 7),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: quanNamCategory.id,
          variants: {
            create: product.variants,
          },
        },
      });
      totalProducts++;
    }
    console.log(`✅ Created ${products.length} products for Quần Nam`);
  }

  // ===== QUẦN NỮ =====
  if (quanNuCategory) {
    const products = [
      {
        name: 'Quần Jean Nữ Skinny',
        slug: 'quan-jean-nu-skinny',
        description: 'Quần jean nữ skinny ôm dáng tôn chân',
        price: 429000,
        originalPrice: 599000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.5,
        reviewCount: 40,
        variants: createVariants(['Xanh đen', 'Đen'], ['26', '27', '28', '29', '30'], 9),
      },
      {
        name: 'Quần Baggy Nữ',
        slug: 'quan-baggy-nu',
        description: 'Quần baggy nữ phong cách Hàn Quốc',
        price: 389000,
        originalPrice: 549000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.4,
        reviewCount: 25,
        variants: createVariants(['Be', 'Xám', 'Đen'], ['S', 'M', 'L'], 10),
      },
      {
        name: 'Chân Váy Nữ',
        slug: 'chan-vay-nu',
        description: 'Chân váy nữ dáng A thanh lịch',
        price: 299000,
        originalPrice: 449000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.6,
        reviewCount: 32,
        variants: createVariants(['Đen', 'Xanh navy', 'Đỏ đô'], ['S', 'M', 'L'], 11),
      },
      {
        name: 'Quần Short Jean Nữ',
        slug: 'quan-short-jean-nu',
        description: 'Quần short jean nữ trẻ trung năng động',
        price: 259000,
        originalPrice: 369000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.3,
        reviewCount: 20,
        variants: createVariants(['Xanh nhạt', 'Xanh đen'], ['26', '27', '28', '29'], 13),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: quanNuCategory.id,
          variants: {
            create: product.variants,
          },
        },
      });
      totalProducts++;
    }
    console.log(`✅ Created ${products.length} products for Quần Nữ`);
  }

  // ===== GIÀY DÉP =====
  if (giayDepCategory) {
    const products = [
      {
        name: 'Giày Sneaker Trắng',
        slug: 'giay-sneaker-trang',
        description: 'Giày sneaker trắng unisex phong cách tối giản',
        price: 599000,
        originalPrice: 899000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.8,
        reviewCount: 55,
        variants: createVariants(['Trắng', 'Trắng đen'], ['38', '39', '40', '41', '42', '43'], 7),
      },
      {
        name: 'Dép Sandal Nam',
        slug: 'dep-sandal-nam',
        description: 'Dép sandal nam quai ngang thoải mái',
        price: 199000,
        originalPrice: 299000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.2,
        reviewCount: 15,
        variants: createVariants(['Đen', 'Nâu'], ['39', '40', '41', '42', '43'], 12),
      },
      {
        name: 'Giày Lười Nam',
        slug: 'giay-luoi-nam',
        description: 'Giày lười nam da công sở lịch sự',
        price: 699000,
        originalPrice: 999000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.7,
        reviewCount: 38,
        variants: createVariants(['Đen', 'Nâu'], ['39', '40', '41', '42', '43'], 6),
      },
      {
        name: 'Giày Cao Gót Nữ',
        slug: 'giay-cao-got-nu',
        description: 'Giày cao gót nữ 7cm thanh lịch',
        price: 549000,
        originalPrice: 799000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.5,
        reviewCount: 30,
        variants: createVariants(['Đen', 'Nude', 'Đỏ'], ['35', '36', '37', '38', '39'], 7),
      },
      {
        name: 'Dép Nữ Đế Bệt',
        slug: 'dep-nu-de-bet',
        description: 'Dép nữ đế bệt êm ái thoải mái',
        price: 189000,
        originalPrice: 279000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.4,
        reviewCount: 22,
        variants: createVariants(['Đen', 'Kem', 'Hồng'], ['35', '36', '37', '38', '39'], 11),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: giayDepCategory.id,
          variants: {
            create: product.variants,
          },
        },
      });
      totalProducts++;
    }
    console.log(`✅ Created ${products.length} products for Giày Dép`);
  }

  // ===== PHỤ KIỆN =====
  if (phuKienCategory) {
    const products = [
      {
        name: 'Túi Xách Nữ',
        slug: 'tui-xach-nu',
        description: 'Túi xách nữ da cao cấp sang trọng',
        price: 799000,
        originalPrice: 1199000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.9,
        reviewCount: 42,
        variants: createVariants(['Đen', 'Nâu', 'Đỏ đô'], ['One Size'], 8),
      },
      {
        name: 'Thắt Lưng Nam Da',
        slug: 'that-lung-nam-da',
        description: 'Thắt lưng nam da thật cao cấp',
        price: 349000,
        originalPrice: 499000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.6,
        reviewCount: 28,
        variants: createVariants(['Đen', 'Nâu'], ['One Size'], 14),
      },
      {
        name: 'Mũ Lưỡi Trai',
        slug: 'mu-luoi-trai',
        description: 'Mũ lưỡi trai unisex phong cách thể thao',
        price: 149000,
        originalPrice: 229000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.3,
        reviewCount: 18,
        variants: createVariants(['Đen', 'Trắng', 'Navy'], ['Free Size'], 20),
      },
      {
        name: 'Kính Mát Nam Nữ',
        slug: 'kinh-mat-nam-nu',
        description: 'Kính mát unisex chống tia UV',
        price: 299000,
        originalPrice: 449000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.7,
        reviewCount: 35,
        variants: createVariants(['Đen', 'Nâu', 'Ghi'], ['One Size'], 13),
      },
      {
        name: 'Ví Nam Da',
        slug: 'vi-nam-da',
        description: 'Ví nam da thật nhỏ gọn tiện lợi',
        price: 279000,
        originalPrice: 399000,
        images: ['/images/placeholder.svg'],
        featured: false,
        rating: 4.5,
        reviewCount: 25,
        variants: createVariants(['Đen', 'Nâu đậm'], ['One Size'], 16),
      },
      {
        name: 'Ba Lô Laptop',
        slug: 'ba-lo-laptop',
        description: 'Ba lô laptop chống nước, nhiều ngăn',
        price: 499000,
        originalPrice: 699000,
        images: ['/images/placeholder.svg'],
        featured: true,
        rating: 4.8,
        reviewCount: 48,
        variants: createVariants(['Đen', 'Xám', 'Navy'], ['One Size'], 11),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          categoryId: phuKienCategory.id,
          variants: {
            create: product.variants,
          },
        },
      });
      totalProducts++;
    }
    console.log(`✅ Created ${products.length} products for Phụ Kiện`);
  }

  // Calculate total variants
  const allProducts = await prisma.product.findMany({
    include: {
      variants: true,
    },
  });
  
  const totalVariants = allProducts.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
  const totalStock = allProducts.reduce(
    (sum, p) => sum + (p.variants?.reduce((s, v) => s + v.stock, 0) || 0),
    0
  );

  console.log('');
  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${totalProducts} products`);
  console.log(`   - ${totalVariants} product variants`);
  console.log(`   - ${totalStock} total stock items`);
  console.log(`   - 1 admin user`);
  console.log('');
  console.log('📝 Admin credentials:');
  console.log('   Email: admin@fashionstore.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
