import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

describe('E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Setup giống main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new ResponseInterceptor(),
      new LoggingInterceptor(),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Seed data cho test
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.idempotencyKey.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    // Cleanup sau khi test xong
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.idempotencyKey.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await app.close();
  });

  // ===== AUTH FLOW =====
  describe('Auth Flow', () => {
    it('POST /auth/register — should register successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@gmail.com',
          password: '123456',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('POST /auth/login — should login successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@gmail.com', password: '123456' });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');

      accessToken = res.body.data.accessToken as string;
    });

    it('POST /auth/login — should fail with wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@gmail.com', password: 'wrong-password' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /auth/profile — should return profile with token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('email', 'test@gmail.com');
    });

    it('GET /auth/profile — should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get(
        '/api/v1/auth/profile',
      );

      expect(res.status).toBe(401);
    });
  });

  // ===== PRODUCT FLOW =====
  describe('Product Flow', () => {
    let productId: string;

    beforeAll(async () => {
      // Tạo admin user để test
      await request(app.getHttpServer()).post('/api/v1/auth/register').send({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
      });

      // Update role thành admin thẳng trong DB
      await prisma.user.update({
        where: { email: 'admin@gmail.com' },
        data: { role: 'admin' },
      });

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@gmail.com', password: 'admin123' });

      adminToken = res.body.data.accessToken as string;
    });

    it('POST /products — should create product as admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          price: 100000,
          stock: 50,
          category: 'test',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.price).toBe(100000);

      productId = res.body.data.id as string;
    });

    it('POST /products — should return 403 for non-admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Product',
          price: 100000,
          stock: 50,
          category: 'test',
        });

      expect(res.status).toBe(403);
    });

    it('GET /products — should return list', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('total');
    });

    it('GET /products/:id — should return product', async () => {
      const res = await request(app.getHttpServer()).get(
        `/api/v1/products/${productId}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', productId);
    });
  });
});
