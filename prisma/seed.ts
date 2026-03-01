import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@delightstore.tz.com' },
    update: {},
    create: {
      email: 'admin@delightstore.tz.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create categories
  const categories = [
    { name: 'Smart Watches', slug: 'smart-watches' },
    { name: 'Gadgets', slug: 'gadgets' },
    { name: 'Speakers', slug: 'speakers' },
    { name: 'Mobile Accessories', slug: 'mobile-accessories' },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(cat);
    console.log('Created category:', cat.name);
  }

  // Create sample products - At least 20 products with names, prices in TZS, and stock
  const products = [
    {
      name: 'Premium Smart Watch Series 9',
      description: 'Latest smart watch with health tracking, GPS, and long battery life.',
      price: 299000,
      stock: 25,
      categorySlug: 'smart-watches',
      images: ['/products/products (1).jpg'],
    },
    {
      name: 'Wireless Bluetooth Earbuds Pro',
      description: 'High-quality wireless earbuds with noise cancellation and 30-hour battery.',
      price: 85000,
      stock: 50,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (2).JPG'],
    },
    {
      name: 'Portable Bluetooth Speaker Max',
      description: 'Powerful portable speaker with 360-degree sound and waterproof design.',
      price: 150000,
      stock: 30,
      categorySlug: 'speakers',
      images: ['/products/products (20).JPG'],
    },
    {
      name: 'Phone Stand with Wireless Charging',
      description: 'Adjustable phone stand with wireless charging support and LED indicator.',
      price: 35000,
      stock: 40,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (30).JPG'],
    },
    {
      name: 'Fitness Tracker Watch Active',
      description: 'Track your fitness goals with this feature-packed fitness watch.',
      price: 120000,
      stock: 35,
      categorySlug: 'smart-watches',
      images: ['/products/products (10).JPG'],
    },
    {
      name: 'USB-C Fast Charging Cable 2m',
      description: 'Durable USB-C cable with fast charging support and braided design.',
      price: 15000,
      stock: 100,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (5).JPG'],
    },
    {
      name: 'Smart Home Hub Controller',
      description: 'Control all your smart home devices from one central hub.',
      price: 250000,
      stock: 15,
      categorySlug: 'gadgets',
      images: ['/products/products (15).JPG'],
    },
    {
      name: 'Premium Over-Ear Headphones',
      description: 'Over-ear headphones with superior sound quality and noise cancellation.',
      price: 180000,
      stock: 20,
      categorySlug: 'speakers',
      images: ['/products/products (25).JPG'],
    },
    {
      name: 'Smart Watch Sport Edition',
      description: 'Rugged smart watch designed for athletes and outdoor activities.',
      price: 220000,
      stock: 18,
      categorySlug: 'smart-watches',
      images: ['/products/products (3).JPG'],
    },
    {
      name: 'Wireless Charging Pad',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      price: 45000,
      stock: 60,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (4).JPG'],
    },
    {
      name: 'Bluetooth Speaker Mini',
      description: 'Compact portable speaker with impressive sound quality.',
      price: 75000,
      stock: 45,
      categorySlug: 'speakers',
      images: ['/products/products (6).JPG'],
    },
    {
      name: 'Smart Ring Fitness Tracker',
      description: 'Elegant smart ring that tracks your health and fitness metrics.',
      price: 195000,
      stock: 12,
      categorySlug: 'smart-watches',
      images: ['/products/products (7).JPG'],
    },
    {
      name: 'Car Phone Mount',
      description: 'Adjustable car mount with strong magnetic grip and 360° rotation.',
      price: 28000,
      stock: 75,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (8).JPG'],
    },
    {
      name: 'Smart LED Strip Lights',
      description: 'RGB LED strip lights with app control and voice assistant support.',
      price: 55000,
      stock: 38,
      categorySlug: 'gadgets',
      images: ['/products/products (9).JPG'],
    },
    {
      name: 'Power Bank 20000mAh',
      description: 'High-capacity power bank with fast charging and dual USB ports.',
      price: 65000,
      stock: 55,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (11).JPG'],
    },
    {
      name: 'Smart Watch Classic',
      description: 'Elegant smart watch with premium design and essential features.',
      price: 175000,
      stock: 22,
      categorySlug: 'smart-watches',
      images: ['/products/products (12).JPG'],
    },
    {
      name: 'Bluetooth Soundbar',
      description: 'Premium soundbar with deep bass and crystal clear audio.',
      price: 320000,
      stock: 8,
      categorySlug: 'speakers',
      images: ['/products/products (13).JPG'],
    },
    {
      name: 'USB-C Hub Multiport',
      description: '7-in-1 USB-C hub with HDMI, USB ports, and card readers.',
      price: 95000,
      stock: 28,
      categorySlug: 'gadgets',
      images: ['/products/products (14).JPG'],
    },
    {
      name: 'Phone Case with Stand',
      description: 'Protective phone case with built-in kickstand and card holder.',
      price: 22000,
      stock: 85,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (16).JPG'],
    },
    {
      name: 'Smart Bulb RGB',
      description: 'WiFi-enabled RGB smart bulb with app control and scheduling.',
      price: 38000,
      stock: 42,
      categorySlug: 'gadgets',
      images: ['/products/products (17).JPG'],
    },
    {
      name: 'Wireless Gaming Headset',
      description: 'Professional gaming headset with surround sound and noise cancellation.',
      price: 145000,
      stock: 16,
      categorySlug: 'speakers',
      images: ['/products/products (18).JPG'],
    },
    {
      name: 'Smart Watch Kids Edition',
      description: 'Child-friendly smart watch with GPS tracking and parental controls.',
      price: 125000,
      stock: 14,
      categorySlug: 'smart-watches',
      images: ['/products/products (19).JPG'],
    },
    {
      name: 'Screen Protector Tempered Glass',
      description: 'Premium tempered glass screen protector with easy installation.',
      price: 12000,
      stock: 120,
      categorySlug: 'mobile-accessories',
      images: ['/products/products (21).JPG'],
    },
    {
      name: 'Smart Plug WiFi',
      description: 'WiFi smart plug for remote control of your home appliances.',
      price: 35000,
      stock: 48,
      categorySlug: 'gadgets',
      images: ['/products/products (22).JPG'],
    },
    {
      name: 'Portable Speaker Waterproof',
      description: 'Waterproof portable speaker perfect for outdoor adventures.',
      price: 88000,
      stock: 32,
      categorySlug: 'speakers',
      images: ['/products/products (23).JPG'],
    },
  ];

  // Add more products using remaining images (we have 25 products, need at least 20 more for variety)
  const productImageNames = [
    'products (24).JPG', 'products (26).JPG', 'products (27).JPG', 'products (28).JPG',
    'products (29).JPG', 'products (31).JPG', 'products (32).JPG', 'products (33).JPG',
    'products (34).JPG', 'products (35).JPG', 'products (36).JPG', 'products (37).JPG',
    'products (38).JPG', 'products (39).JPG', 'products (40).JPG', 'products (41).JPG',
    'products (42).JPG', 'products (43).JPG', 'products (44).JPG', 'products (45).JPG',
    'products (46).JPG', 'products (47).JPG'
  ];

  const additionalProducts = [
    { name: 'Tablet Stand Adjustable', price: 32000, stock: 52, categorySlug: 'mobile-accessories' },
    { name: 'Laptop Cooling Pad', price: 48000, stock: 35, categorySlug: 'gadgets' },
    { name: 'HDMI Cable 4K', price: 18000, stock: 90, categorySlug: 'gadgets' },
    { name: 'USB-C to HDMI Adapter', price: 25000, stock: 68, categorySlug: 'mobile-accessories' },
    { name: 'Cable Management Box', price: 15000, stock: 110, categorySlug: 'gadgets' },
    { name: 'Phone Grip Ring', price: 8000, stock: 150, categorySlug: 'mobile-accessories' },
    { name: 'PopSocket Phone Grip', price: 12000, stock: 95, categorySlug: 'mobile-accessories' },
    { name: 'Wallet Phone Case', price: 28000, stock: 58, categorySlug: 'mobile-accessories' },
    { name: 'Battery Case 5000mAh', price: 55000, stock: 25, categorySlug: 'mobile-accessories' },
    { name: 'Selfie Stick Extendable', price: 22000, stock: 72, categorySlug: 'mobile-accessories' },
    { name: 'Tripod Stand Universal', price: 42000, stock: 44, categorySlug: 'gadgets' },
    { name: 'Gimbal Stabilizer 3-Axis', price: 185000, stock: 9, categorySlug: 'gadgets' },
    { name: 'Action Camera 4K', price: 245000, stock: 11, categorySlug: 'gadgets' },
    { name: 'Drone Mini Foldable', price: 385000, stock: 6, categorySlug: 'gadgets' },
    { name: 'VR Headset Virtual Reality', price: 295000, stock: 7, categorySlug: 'gadgets' },
    { name: 'Game Controller Wireless', price: 125000, stock: 19, categorySlug: 'gadgets' },
    { name: 'Security Camera WiFi', price: 165000, stock: 13, categorySlug: 'gadgets' },
    { name: 'Smart Doorbell Camera', price: 225000, stock: 10, categorySlug: 'gadgets' },
    { name: 'Wireless Keyboard Mouse Combo', price: 75000, stock: 31, categorySlug: 'gadgets' },
    { name: 'Webcam HD 1080p', price: 95000, stock: 27, categorySlug: 'gadgets' },
    { name: 'USB Microphone Studio', price: 115000, stock: 21, categorySlug: 'gadgets' },
    { name: 'Monitor Stand Ergonomic', price: 65000, stock: 36, categorySlug: 'gadgets' },
  ];

  // Add additional products
  for (let i = 0; i < additionalProducts.length && i < productImageNames.length; i++) {
    const product = additionalProducts[i];
    products.push({
      name: product.name,
      description: `Premium ${product.name.toLowerCase()} from DelightStore. High quality and reliable.`,
      price: product.price,
      stock: product.stock,
      categorySlug: product.categorySlug,
      images: [`/products/${productImageNames[i]}`],
    });
  }

  for (const product of products) {
    const category = createdCategories.find(c => c.slug === product.categorySlug);
    if (!category) continue;

    try {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images,
          categoryId: category.id,
        },
      });
      console.log('Created product:', product.name);
    } catch (error: any) {
      // Skip if product already exists
      if (error.code === 'P2002') {
        console.log('Product already exists:', product.name);
      } else {
        console.error('Error creating product:', product.name, error);
      }
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
