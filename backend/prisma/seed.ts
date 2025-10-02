import { PrismaClient, Category } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  // Create products for each category
  const aoNamCategory = createdCategories.find(c => c.slug === 'ao-nam');
  const aoNuCategory = createdCategories.find(c => c.slug === 'ao-nu');
  const quanNamCategory = createdCategories.find(c => c.slug === 'quan-nam');
  const quanNuCategory = createdCategories.find(c => c.slug === 'quan-nu');
  const giayDepCategory = createdCategories.find(c => c.slug === 'giay-dep');
  const phuKienCategory = createdCategories.find(c => c.slug === 'phu-kien');

  // ===== ÁO NAM =====
  if (aoNamCategory) {
    const aoNamProducts = [
      {
        name: 'Áo Thun Basic Nam',
        slug: 'ao-thun-basic-nam',
        description: 'Áo thun nam form regular, chất liệu cotton 100% thấm hút mồ hôi tốt',
        price: 199000,
        originalPrice: 299000,
        images: ['/images/placeholder.svg'],
        colors: ['Trắng', 'Đen', 'Xám'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 100,
        featured: true,
        rating: 4.5,
        reviewCount: 25,
      },
      {
        name: 'Áo Sơ Mi Trắng Nam',
        slug: 'ao-somi-trang-nam',
        description: 'Áo sơ mi nam dài tay, phù hợp đi làm và dự tiệc',
        price: 399000,
        originalPrice: 599000,
        images: ['/images/placeholder.svg'],
        colors: ['Trắng', 'Xanh nhạt', 'Hồng'],
        sizes: ['M', 'L', 'XL', 'XXL'],
        stock: 50,
        featured: true,
        rating: 4.8,
        reviewCount: 45,
      },
      {
        name: 'Áo Polo Nam',
        slug: 'ao-polo-nam',
        description: 'Áo polo nam có cổ, phong cách thể thao lịch sự',
        price: 249000,
        originalPrice: 349000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Navy', 'Đỏ đô'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 80,
        featured: false,
        rating: 4.6,
        reviewCount: 30,
      },
      {
        name: 'Áo Khoác Jean Nam',
        slug: 'ao-khoac-jean-nam',
        description: 'Áo khoác jean nam phong cách streetwear',
        price: 549000,
        originalPrice: 799000,
        images: ['/images/placeholder.svg'],
        colors: ['Xanh đậm', 'Đen'],
        sizes: ['M', 'L', 'XL'],
        stock: 40,
        featured: true,
        rating: 4.7,
        reviewCount: 20,
      },
      {
        name: 'Áo Hoodie Nam',
        slug: 'ao-hoodie-nam',
        description: 'Áo hoodie nam có mũ, ấm áp thoải mái',
        price: 459000,
        originalPrice: 649000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Xám', 'Navy'],
        sizes: ['M', 'L', 'XL', 'XXL'],
        stock: 60,
        featured: false,
        rating: 4.4,
        reviewCount: 18,
      },
    ];

    for (const product of aoNamProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: { ...product, categoryId: aoNamCategory.id },
      });
    }
    console.log(`✅ Created ${aoNamProducts.length} products for Áo Nam`);
  }

  // ===== ÁO NỮ =====
  if (aoNuCategory) {
    const aoNuProducts = [
      {
        name: 'Áo Croptop Nữ',
        slug: 'ao-croptop-nu',
        description: 'Áo croptop nữ phong cách trẻ trung, năng động',
        price: 159000,
        originalPrice: 249000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Trắng', 'Hồng'],
        sizes: ['S', 'M', 'L'],
        stock: 80,
        featured: true,
        rating: 4.3,
        reviewCount: 32,
      },
      {
        name: 'Váy Maxi Nữ',
        slug: 'vay-maxi-nu',
        description: 'Váy maxi dài thanh lịch, thích hợp dự tiệc',
        price: 599000,
        originalPrice: 899000,
        images: ['/images/placeholder.svg'],
        colors: ['Đỏ', 'Đen', 'Navy'],
        sizes: ['S', 'M', 'L'],
        stock: 30,
        featured: true,
        rating: 4.7,
        reviewCount: 18,
      },
      {
        name: 'Áo Kiểu Nữ',
        slug: 'ao-kieu-nu',
        description: 'Áo kiểu nữ công sở sang trọng',
        price: 349000,
        originalPrice: 499000,
        images: ['/images/placeholder.svg'],
        colors: ['Trắng', 'Hồng pastel', 'Xanh mint'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 70,
        featured: false,
        rating: 4.5,
        reviewCount: 28,
      },
      {
        name: 'Áo Sơ Mi Nữ',
        slug: 'ao-somi-nu',
        description: 'Áo sơ mi nữ dài tay, form dáng thanh lịch',
        price: 379000,
        originalPrice: 549000,
        images: ['/images/placeholder.svg'],
        colors: ['Trắng', 'Đen', 'Xanh navy'],
        sizes: ['S', 'M', 'L'],
        stock: 55,
        featured: false,
        rating: 4.6,
        reviewCount: 24,
      },
      {
        name: 'Áo Len Nữ',
        slug: 'ao-len-nu',
        description: 'Áo len nữ ấm áp, phù hợp mùa đông',
        price: 429000,
        originalPrice: 599000,
        images: ['/images/placeholder.svg'],
        colors: ['Be', 'Nâu', 'Đen'],
        sizes: ['S', 'M', 'L'],
        stock: 45,
        featured: true,
        rating: 4.8,
        reviewCount: 15,
      },
    ];

    for (const product of aoNuProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: { ...product, categoryId: aoNuCategory.id },
      });
    }
    console.log(`✅ Created ${aoNuProducts.length} products for Áo Nữ`);
  }

  // ===== QUẦN NAM =====
  if (quanNamCategory) {
    const quanNamProducts = [
      {
        name: 'Quần Jean Nam Slimfit',
        slug: 'quan-jean-nam-slimfit',
        description: 'Quần jean nam form slimfit ôm vừa vặn',
        price: 449000,
        originalPrice: 649000,
        images: ['/images/placeholder.svg'],
        colors: ['Xanh đen', 'Xanh nhạt'],
        sizes: ['29', '30', '31', '32', '33'],
        stock: 65,
        featured: true,
        rating: 4.6,
        reviewCount: 35,
      },
      {
        name: 'Quần Kaki Nam',
        slug: 'quan-kaki-nam',
        description: 'Quần kaki nam công sở lịch sự',
        price: 359000,
        originalPrice: 499000,
        images: ['/images/placeholder.svg'],
        colors: ['Be', 'Xám', 'Đen'],
        sizes: ['29', '30', '31', '32'],
        stock: 75,
        featured: false,
        rating: 4.4,
        reviewCount: 22,
      },
      {
        name: 'Quần Short Nam',
        slug: 'quan-short-nam',
        description: 'Quần short nam thể thao thoải mái',
        price: 229000,
        originalPrice: 329000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Xám', 'Navy'],
        sizes: ['M', 'L', 'XL'],
        stock: 90,
        featured: false,
        rating: 4.3,
        reviewCount: 18,
      },
      {
        name: 'Quần Tây Nam',
        slug: 'quan-tay-nam',
        description: 'Quần tây nam công sở cao cấp',
        price: 499000,
        originalPrice: 699000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Xám đậm', 'Navy'],
        sizes: ['29', '30', '31', '32', '33'],
        stock: 50,
        featured: true,
        rating: 4.7,
        reviewCount: 28,
      },
    ];

    for (const product of quanNamProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: { ...product, categoryId: quanNamCategory.id },
      });
    }
    console.log(`✅ Created ${quanNamProducts.length} products for Quần Nam`);
  }

  // ===== QUẦN NỮ =====
  if (quanNuCategory) {
    const quanNuProducts = [
      {
        name: 'Quần Jean Nữ Skinny',
        slug: 'quan-jean-nu-skinny',
        description: 'Quần jean nữ skinnyôm dáng tôn chân',
        price: 429000,
        originalPrice: 599000,
        images: ['/images/placeholder.svg'],
        colors: ['Xanh đen', 'Đen'],
        sizes: ['26', '27', '28', '29', '30'],
        stock: 70,
        featured: true,
        rating: 4.5,
        reviewCount: 40,
      },
      {
        name: 'Quần Baggy Nữ',
        slug: 'quan-baggy-nu',
        description: 'Quần baggy nữ phong cách Hàn Quốc',
        price: 389000,
        originalPrice: 549000,
        images: ['/images/placeholder.svg'],
        colors: ['Be', 'Xám', 'Đen'],
        sizes: ['S', 'M', 'L'],
        stock: 60,
        featured: false,
        rating: 4.4,
        reviewCount: 25,
      },
      {
        name: 'Chân Váy Nữ',
        slug: 'chan-vay-nu',
        description: 'Chân váy nữ dáng A thanh lịch',
        price: 299000,
        originalPrice: 449000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Xanh navy', 'Đỏ đô'],
        sizes: ['S', 'M', 'L'],
        stock: 55,
        featured: true,
        rating: 4.6,
        reviewCount: 32,
      },
      {
        name: 'Quần Short Jean Nữ',
        slug: 'quan-short-jean-nu',
        description: 'Quần short jean nữ trẻ trung năng động',
        price: 259000,
        originalPrice: 369000,
        images: ['/images/placeholder.svg'],
        colors: ['Xanh nhạt', 'Xanh đen'],
        sizes: ['26', '27', '28', '29'],
        stock: 80,
        featured: false,
        rating: 4.3,
        reviewCount: 20,
      },
    ];

    for (const product of quanNuProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: { ...product, categoryId: quanNuCategory.id },
      });
    }
    console.log(`✅ Created ${quanNuProducts.length} products for Quần Nữ`);
  }

  // ===== GIÀY DÉP =====
  if (giayDepCategory) {
    const giayDepProducts = [
      {
        name: 'Giày Sneaker Trắng',
        slug: 'giay-sneaker-trang',
        description: 'Giày sneaker trắng unisex phong cách tối giản',
        price: 599000,
        originalPrice: 899000,
        images: ['/images/placeholder.svg'],
        colors: ['Trắng', 'Trắng đen'],
        sizes: ['38', '39', '40', '41', '42', '43'],
        stock: 85,
        featured: true,
        rating: 4.8,
        reviewCount: 55,
      },
      {
        name: 'Dép Sandal Nam',
        slug: 'dep-sandal-nam',
        description: 'Dép sandal nam quai ngang thoải mái',
        price: 199000,
        originalPrice: 299000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nâu'],
        sizes: ['39', '40', '41', '42', '43'],
        stock: 100,
        featured: false,
        rating: 4.2,
        reviewCount: 15,
      },
      {
        name: 'Giày Lười Nam',
        slug: 'giay-luoi-nam',
        description: 'Giày lười nam da công sở lịch sự',
        price: 699000,
        originalPrice: 999000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nâu'],
        sizes: ['39', '40', '41', '42', '43'],
        stock: 45,
        featured: true,
        rating: 4.7,
        reviewCount: 38,
      },
      {
        name: 'Giày Cao Gót Nữ',
        slug: 'giay-cao-got-nu',
        description: 'Giày cao gót nữ 7cm thanh lịch',
        price: 549000,
        originalPrice: 799000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nude', 'Đỏ'],
        sizes: ['35', '36', '37', '38', '39'],
        stock: 50,
        featured: true,
        rating: 4.5,
        reviewCount: 30,
      },
      {
        name: 'Dép Nữ Đế Bệt',
        slug: 'dep-nu-de-bet',
        description: 'Dép nữ đế bệt êm ái thoải mái',
        price: 189000,
        originalPrice: 279000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Kem', 'Hồng'],
        sizes: ['35', '36', '37', '38', '39'],
        stock: 95,
        featured: false,
        rating: 4.4,
        reviewCount: 22,
      },
    ];

    for (const product of giayDepProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: { ...product, categoryId: giayDepCategory.id },
      });
    }
    console.log(`✅ Created ${giayDepProducts.length} products for Giày Dép`);
  }

  // ===== PHỤ KIỆN =====
  if (phuKienCategory) {
    const phuKienProducts = [
      {
        name: 'Túi Xách Nữ',
        slug: 'tui-xach-nu',
        description: 'Túi xách nữ da cao cấp sang trọng',
        price: 799000,
        originalPrice: 1199000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nâu', 'Đỏ đô'],
        sizes: ['One Size'],
        stock: 40,
        featured: true,
        rating: 4.9,
        reviewCount: 42,
      },
      {
        name: 'Thắt Lưng Nam Da',
        slug: 'that-lung-nam-da',
        description: 'Thắt lưng nam da thật cao cấp',
        price: 349000,
        originalPrice: 499000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nâu'],
        sizes: ['One Size'],
        stock: 70,
        featured: false,
        rating: 4.6,
        reviewCount: 28,
      },
      {
        name: 'Mũ Lưỡi Trai',
        slug: 'mu-luoi-trai',
        description: 'Mũ lưỡi trai unisex phong cách thể thao',
        price: 149000,
        originalPrice: 229000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Trắng', 'Navy'],
        sizes: ['Free Size'],
        stock: 120,
        featured: false,
        rating: 4.3,
        reviewCount: 18,
      },
      {
        name: 'Kính Mát Nam Nữ',
        slug: 'kinh-mat-nam-nu',
        description: 'Kính mát unisex chống tia UV',
        price: 299000,
        originalPrice: 449000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nâu', 'Ghi'],
        sizes: ['One Size'],
        stock: 65,
        featured: true,
        rating: 4.7,
        reviewCount: 35,
      },
      {
        name: 'Ví Nam Da',
        slug: 'vi-nam-da',
        description: 'Ví nam da thật nhỏ gọn tiện lợi',
        price: 279000,
        originalPrice: 399000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Nâu đậm'],
        sizes: ['One Size'],
        stock: 80,
        featured: false,
        rating: 4.5,
        reviewCount: 25,
      },
      {
        name: 'Ba Lô Laptop',
        slug: 'ba-lo-laptop',
        description: 'Ba lô laptop chống nước, nhiều ngăn',
        price: 499000,
        originalPrice: 699000,
        images: ['/images/placeholder.svg'],
        colors: ['Đen', 'Xám', 'Navy'],
        sizes: ['One Size'],
        stock: 55,
        featured: true,
        rating: 4.8,
        reviewCount: 48,
      },
    ];

    for (const product of phuKienProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: { ...product, categoryId: phuKienCategory.id },
      });
    }
    console.log(`✅ Created ${phuKienProducts.length} products for Phụ Kiện`);
  }

  console.log('');
  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 6 categories');
  console.log('   - 30 products total');
  console.log('   - 1 admin user');
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
