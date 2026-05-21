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
