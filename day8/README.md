# Identity & Image Micro-service

API phục vụ xác thực người dùng (Identity) và xử lý ảnh (Image), hỗ trợ cả App và Web client.

---

## Quá trình phát triển

| Day | Nội dung |
|-----|----------|
| Day 8  | Skeleton & Routing |
| Day 9  | Validation & Error handling |
| Day 10 | Auth JWT |
| Day 11 | Upload Image |
| Day 12 | Security & Rate limit |
| Day 13 | Testing |
| Day 14 | Project hoàn chỉnh (Level 2) |

---

## Yêu cầu

- Node.js >= 18
- pnpm >= 10

---

## Cài đặt & Chạy

```bash
# Cài dependencies
pnpm install

# Tạo file môi trường
cp .env.example .env

# Tạo thư mục logs
mkdir -p logs

# Chạy development
pnpm dev

# Chạy production
pnpm start

# Chạy tests
pnpm test
```

Server chạy tại: `http://localhost:3000`

---

## Biến môi trường

Tạo file `.env` từ `.env.example` và điền các giá trị:

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `PORT` | Port server | `3000` |
| `NODE_ENV` | Môi trường (`development` / `production`) | `development` |
| `JWT_SECRET` | Secret key để ký JWT | `secret123` |
| `LOG_LEVEL` | Mức độ log (`info` / `debug` / `error`) | `info` |
| `TELEGRAM_BOT_TOKEN` | Token bot Telegram nhận thông báo lỗi | — |
| `TELEGRAM_CHAT_ID` | Chat ID nhận thông báo lỗi | — |

---

## Cấu trúc project

```
src/
├── config/
│   ├── logger.js               # Winston logger, ghi file theo ngày
│   ├── telegram.js             # Gửi thông báo lỗi qua Telegram
│   └── security.js             # Cấu hình helmet, cors
├── controllers/
│   ├── auth.controller.js
│   └── upload.controller.js
├── errors/
│   └── AppError.js             # Custom error class
├── middlewares/
│   ├── authenticate.js         # Verify JWT, gắn req.user
│   ├── authorize.js            # Kiểm tra role (admin/member)
│   ├── errorHandler.js         # Xử lý lỗi tập trung + notify Telegram
│   ├── rateLimiter.js          # Rate limiting
│   ├── requestLogger.js        # Log mọi request gửi lên
│   ├── upload.js               # Multer config
│   └── validate.js             # Zod validation
├── routes/v1/
│   ├── index.js
│   ├── auth.route.js
│   ├── user.route.js
│   └── upload.route.js
├── schemas/
│   └── user.schema.js
├── services/
│   ├── activityLog.service.js  # Ghi lịch sử hành động user
│   ├── auth.service.js
│   └── image.service.js
├── __tests__/
│   ├── auth.service.test.js
│   ├── auth.route.test.js
│   └── image.service.test.js
├── app.js
└── server.js
uploads/
├── originals/                  # Ảnh gốc sau khi upload
└── processed/                  # Ảnh đã xử lý (webp)
logs/
├── 2026-04-22.log              # Log tất cả request theo ngày
└── ...
```

---

## Tính năng Level 2

### 1. Phân quyền Admin / Member

JWT token chứa `role` của user. Mỗi route được bảo vệ bằng 2 middleware:

- `authenticate` — verify token, gắn `req.user`
- `authorize('admin')` / `authorize('admin', 'member')` — kiểm tra role

| Route | Quyền | Ghi chú |
|-------|-------|---------|
| `GET /users` | admin | Admin thấy đầy đủ thông tin |
| `GET /users/:id` | admin, member | Member chỉ xem được của chính mình |
| `POST /users` | admin | |
| `GET /users/logs` | admin | Xem lịch sử hoạt động |

### 2. Ghi log theo ngày

Dùng Winston + `winston-daily-rotate-file`. Mỗi ngày tạo 1 file log mới trong thư mục `logs/`, tự động xóa sau 14 ngày.

Format mỗi dòng log:
```
[2026-04-22 07:49:25] INFO  POST /api/v1/auth/login | 200 | 34ms | IP: ::1 | User: 1
```

### 3. Thông báo lỗi qua Telegram

Khi có lỗi 500 (bug thật trong code), server tự động gửi thông báo vào Telegram kèm đầy đủ thông tin: thời gian, method, path, user, IP, stack trace.

> Chỉ gửi khi lỗi 500+ — không spam khi user nhập sai dữ liệu.

### 4. Activity Logs

Ghi lại lịch sử hành động của user. Hiện dùng in-memory, sau này thay bằng DB thật.

| Action | Khi nào ghi |
|--------|-------------|
| `REGISTER` | User đăng ký tài khoản |
| `LOGIN` | User đăng nhập thành công |

Admin xem được lịch sử qua `GET /api/v1/users/logs`.

---

## Bảo mật

| Tính năng | Mô tả |
|-----------|-------|
| Helmet | Tự động set HTTP security headers |
| CORS | Chỉ cho phép domain được cấu hình gọi API |
| Rate limit login | Tối đa 5 lần đăng nhập / 15 phút / IP |
| Rate limit chung | Tối đa 100 request / 15 phút / IP |
| Ẩn stack trace | Không lộ chi tiết lỗi nội bộ ở production |
| Phân quyền | Admin/Member với JWT role-based access control |

---

## API Endpoints

### Auth

#### POST `/api/v1/auth/register`

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response 201:**
```json
{
  "message": "Register thành công",
  "user": { "id": 1, "email": "john@example.com" }
}
```

**Response 409:**
```json
{ "code": "EMAIL_EXISTED", "message": "Email đã được sử dụng" }
```

---

#### POST `/api/v1/auth/login`

**Request body:**
```json
{ "email": "john@example.com", "password": "123456" }
```

**Response 200 — Web client:**
```json
{ "accessToken": "eyJhbGci..." }
```

**Response 200 — App client** (thêm header `x-client: app`):
```json
{ "accessToken": "eyJhbGci...", "refreshToken": "..." }
```

**Response 401:**
```json
{ "code": "INVALID_CREDENTIALS", "message": "Email hoặc password sai" }
```

**Response 429:**
```json
{ "code": "TOO_MANY_REQUESTS", "message": "Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút." }
```

---

### Users

> Tất cả `/users` routes yêu cầu header `Authorization: Bearer <token>`

#### GET `/api/v1/users` — *Admin only*

**Response 200:**
```json
{
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "admin", "createdAt": "..." }
  ]
}
```

---

#### GET `/api/v1/users/logs` — *Admin only*

Xem lịch sử hành động của tất cả user.

**Response 200:**
```json
{
  "total": 2,
  "data": [
    { "id": 1, "userId": 1, "action": "LOGIN", "description": "...", "ip": "::1", "createdAt": "..." }
  ]
}
```

---

#### GET `/api/v1/users/:id` — *Admin + Member*

- Admin: thấy đầy đủ thông tin
- Member: chỉ thấy `id`, `name`, `email` của chính mình

---

#### POST `/api/v1/users` — *Admin only*

**Response 201:**
```json
{ "message": "Tạo user thành công", "user": {} }
```

---

### Upload

#### POST `/api/v1/upload`

Upload và xử lý ảnh. Resize tối đa 800x800, convert sang `.webp`.

**Request:** `multipart/form-data`, field `image`

**Response 201:**
```json
{
  "url": "/uploads/processed/processed-1234567890.webp",
  "width": 800,
  "height": 600,
  "size": 45231
}
```

---

## Headers đặc biệt

| Header | Giá trị | Mô tả |
|--------|---------|-------|
| `Authorization` | `Bearer <token>` | Xác thực JWT |
| `x-client` | `app` hoặc `web` | Xác định loại client khi login |

---

## Tests

```bash
pnpm test
```

```
✓ auth.service.test.js  (5 tests)
✓ image.service.test.js (4 tests)
✓ auth.route.test.js    (5 tests)
─────────────────────────────────
  14 tests passed
```