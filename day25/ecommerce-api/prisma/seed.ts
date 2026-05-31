import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Xóa data cũ
  await prisma.user.deleteMany();

  // Tạo admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Tạo user thường
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: userPassword,
      role: 'user',
    },
  });

  // Tạo 1000 products để benchmark
  console.log('Seeding 1000 products...');
  const categories = ['fashion', 'food', 'tech', 'sport', 'beauty'];
  for (let i = 0; i < 1000; i++) {
    await prisma.product.create({
      data: {
        name: `Product ${i}`,
        price: Math.random() * 1000000,
        stock: Math.floor(Math.random() * 100),
        category: categories[i % 5],
        isActive: true,
      },
    });
  }

  console.log('Seeding done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
