# E-commerce API

NestJS E-commerce backend system với đầy đủ tính năng: Auth, Product, Order, Payment.

## Tech Stack

- **Framework**: NestJS + TypeScript
- **Database**: MySQL + Prisma ORM
- **Auth**: JWT (Access + Refresh token)
- **Docs**: Swagger/OpenAPI

## Yêu cầu

- Node.js 20+
- MySQL 8.0+ hoặc Docker
- pnpm

## Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd ecommerce-api

# Cài dependencies
pnpm install

# Copy env
cp .env.example .env
# Điền các giá trị vào .env
```

## Chạy với Docker (khuyến nghị)

```bash
# Khởi động MySQL
pnpm run docker:up

# Chạy migration + seed
pnpm run db:migrate
pnpm run db:seed

# Chạy app
pnpm run start:dev
```

## Chạy với MySQL local

```bash
# Cập nhật DATABASE_URL trong .env
# Chạy migration + seed
pnpm run db:migrate
pnpm run db:seed

# Chạy app
pnpm run start:dev
```

## API Docs

Swagger UI: http://localhost:3000/api/docs

## Scripts

| Script | Mô tả |
|--------|-------|
| `pnpm run start:dev` | Chạy development |
| `pnpm run start:prod` | Chạy production |
| `pnpm run test` | Unit tests |
| `pnpm run test:e2e` | E2E tests |
| `pnpm run test:all` | Tất cả tests |
| `pnpm run db:migrate` | Chạy migration |
| `pnpm run db:seed` | Seed data |
| `pnpm run docker:up` | Khởi động Docker |

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/v1/auth/register | Đăng ký |
| POST | /api/v1/auth/login | Đăng nhập |
| GET | /api/v1/products | Danh sách sản phẩm |
| POST | /api/v1/orders | Tạo đơn hàng |
| POST | /api/v1/payments | Thanh toán |

## Testing

```bash
# Chạy tất cả tests
pnpm run test:all

# Unit tests: 13 tests
# E2E tests: 12 tests
# Tổng: 25 tests
```