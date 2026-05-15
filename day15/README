# LMS API

Hệ thống quản lý học tập (Learning Management System) xây dựng bằng AdonisJS v6 + MySQL.

## Tech Stack

- **Runtime:** Node.js >= 20
- **Framework:** AdonisJS v7
- **Database:** MySQL 8
- **ORM:** Lucid v22
- **Auth:** Access Tokens
- **Package Manager:** pnpm
- **Language:** TypeScript

## Yêu cầu

- Node.js >= 20
- MySQL >= 8
- pnpm

## Cài đặt

```bash
# Clone project
git clone <repo_url>
cd day15

# Cài dependencies
pnpm install

# Copy file env
cp .env.example .env
```

## Cấu hình `.env`

```env
# Node
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development

# App
APP_KEY=           # generate bằng: node ace generate:key
APP_URL=http://${HOST}:${PORT}

# Session
SESSION_DRIVER=cookie

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=lms_db

# Mail (Gmail SMTP)
MAIL_MAILER=smtp
MAIL_FROM_NAME=LMS System
MAIL_FROM_ADDRESS=your_gmail@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_gmail@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Gmail App Password
```

> **Tạo Gmail App Password:**
> 1. Vào myaccount.google.com → Security → 2-Step Verification (bật nếu chưa)
> 2. Security → App passwords → Tạo mới với tên "LMS"
> 3. Copy password 16 ký tự vào `SMTP_PASSWORD`

## Chạy Migration + Seed

```bash
# Tạo bảng
node ace migration:run

# Seed data demo
# (3 roles, 5 instructors, 100 students, 20 courses, ~400 enrollments)
node ace db:seed --files database/seeders/index_seeder.ts
```

## Chạy Server

```bash
# Development (có HMR)
pnpm dev
# hoặc
node ace serve --hmr

# Production
pnpm build
pnpm start
```

## Chạy Tests

```bash
pnpm test
# hoặc
node ace test
```

## Test Accounts (sau khi seed)

| Email | Password | Role |
|-------|----------|------|
| instructor1@lms.com | password123 | instructor |
| instructor2@lms.com | password123 | instructor |
| student1@lms.com | password123 | student |
| student2@lms.com | password123 | student |

## API Endpoints

Base URL: `http://localhost:3333/api/v1`

### Healthcheck
| Method | URL | Auth | Mô tả |
|--------|-----|------|-------|
| GET | /health | ❌ | Kiểm tra server |

### Auth
| Method | URL | Auth | Mô tả |
|--------|-----|------|-------|
| POST | /auth/register | ❌ | Đăng ký (`role`: student/instructor) |
| POST | /auth/login | ❌ | Đăng nhập |
| GET | /account/profile | ✅ | Thông tin cá nhân |
| POST | /account/logout | ✅ | Đăng xuất |

### Courses
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /courses | ❌ | - | Danh sách (pagination + filter + search) |
| GET | /courses/:id | ❌ | - | Chi tiết course kèm lessons |
| POST | /courses | ✅ | instructor | Tạo course |
| PUT | /courses/:id | ✅ | instructor (owner) | Sửa course |
| DELETE | /courses/:id | ✅ | instructor (owner) | Xóa course |

> Query params: `?page=1&limit=10&status=published&search=nodejs`

### Lessons
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /courses/:course_id/lessons | ❌ | - | Danh sách lessons |
| GET | /courses/:course_id/lessons/:id | ❌ | - | Chi tiết lesson |
| POST | /courses/:course_id/lessons | ✅ | instructor (owner) | Tạo lesson |
| PUT | /courses/:course_id/lessons/:id | ✅ | instructor (owner) | Sửa lesson |
| DELETE | /courses/:course_id/lessons/:id | ✅ | instructor (owner) | Xóa lesson |

### Assignments
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /courses/:course_id/assignments | ❌ | - | Danh sách assignments |
| GET | /courses/:course_id/assignments/:id | ❌ | - | Chi tiết assignment |
| POST | /courses/:course_id/assignments | ✅ | instructor (owner) | Tạo assignment |
| PUT | /courses/:course_id/assignments/:id | ✅ | instructor (owner) | Sửa assignment |
| DELETE | /courses/:course_id/assignments/:id | ✅ | instructor (owner) | Xóa assignment |

### Enrollments
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /enrollments | ✅ | student | Danh sách courses đã enroll |
| POST | /enrollments | ✅ | student | Enroll course |
| DELETE | /enrollments/:id | ✅ | student (owner) | Hủy enrollment |

### Submissions
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /submissions | ✅ | student | Danh sách bài đã nộp |
| GET | /submissions/:id | ✅ | student (owner) | Chi tiết bài nộp kèm grade |
| POST | /submissions | ✅ | student (enrolled) | Nộp bài |
| PUT | /submissions/:id | ✅ | student (owner, draft) | Sửa bài nộp |

### Grades
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /grades | ✅ | instructor | Danh sách bài đã chấm |
| GET | /grades/:id | ✅ | instructor | Chi tiết grade |
| POST | /grades | ✅ | instructor (owner) | Chấm điểm |

### Reports
| Method | URL | Auth | Role | Mô tả |
|--------|-----|------|------|-------|
| GET | /reports/courses/:course_id/stats | ✅ | instructor (owner) | Thống kê course |
| GET | /reports/courses/:course_id/top-students | ✅ | instructor (owner) | Top 10 students |

## Roles & Permissions

| Action | admin | instructor | student |
|--------|-------|------------|---------|
| Tạo course | ❌ | ✅ | ❌ |
| Sửa/xóa course | ❌ | ✅ (owner) | ❌ |
| Tạo lesson/assignment | ❌ | ✅ (owner) | ❌ |
| Enroll course | ❌ | ❌ | ✅ |
| Nộp bài | ❌ | ❌ | ✅ (enrolled) |
| Chấm điểm | ❌ | ✅ (owner) | ❌ |
| Xem report | ❌ | ✅ (owner) | ❌ |

## Cấu trúc thư mục

```
app/
├── controllers/     # Xử lý HTTP request
├── models/          # Lucid ORM models
├── services/        # Business logic
├── policies/        # Authorization (Bouncer)
├── validators/      # Input validation (VineJS)
├── transformers/    # Response formatting
├── middleware/      # HTTP middleware
└── exceptions/      # Error handling

database/
├── migrations/      # Database schema
└── seeders/         # Seed data

tests/
└── functional/
    └── flows/       # E2E tests
```

## Database Schema

```
users ──< role_user >── roles
users ──< enrollments >── courses ──< lessons
courses ──< assignments ──< submissions ──< grades
users ──< submissions
```