# Ngày 7 — Project Mini: CLI MySQL Manager (Thực chiến)

Xây dựng CLI tool kết nối MySQL, đọc file CSV chứa danh sách user, validate và import vào Database — có báo cáo kết quả chi tiết.

---

## Cấu trúc project

```
day7/
├── src/
│   ├── types/
│   │   └── csv.ts          ← DTO types dùng chung (RawCsvRow, ValidRow, RejectedRow)
│   ├── db.ts               ← MySQL Connection Pool
│   ├── index.ts            ← Entry point: điều phối toàn bộ pipeline
│   ├── parser.ts           ← Đọc và parse file CSV thành RawCsvRow[]
│   ├── result.ts           ← Generic Result<T,E> type + helpers ok/err
│   └── validator.ts        ← Validate từng row theo business rules
├── data/
│   └── users.csv           ← Dataset mẫu đầu vào
├── exports/                ← Tự động tạo khi chạy
│   ├── rejected.csv        ← Các row bị loại sau validation
│   └── report.json         ← Báo cáo tổng hợp kết quả pipeline
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── schema.sql              ← Schema MySQL (tạo DB + bảng users)
├── tsconfig.json
└── README.md
```

---

## Yêu cầu

- Node.js đã cài đặt
- MySQL đang chạy ở local
- Cài dependencies:

```bash
pnpm install
```

---

## Cài đặt Database

Chạy file `schema.sql` để khởi tạo database và bảng:

```bash
mysql -u root -p < schema.sql
```

Nội dung schema:

```sql
CREATE DATABASE IF NOT EXISTS day7_db;
USE day7_db;

CREATE TABLE IF NOT EXISTS users (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  age   INT,
  UNIQUE KEY uq_email (email)
);
```

> **Chiến lược xử lý trùng lặp:** Dùng `INSERT IGNORE` — nếu email đã tồn tại trong DB thì bỏ qua, không báo lỗi, không ghi đè.

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

---

## Cách chạy

### Dry-run — mô phỏng, không ghi DB

```bash
pnpm ts-node src/index.ts --file data/users.csv --dry-run
```

### Commit — ghi thật vào MySQL

```bash
pnpm ts-node src/index.ts --file data/users.csv --commit
```

### Dùng script có sẵn

```bash
pnpm dev
# tương đương: ts-node src/index.ts --file data/users.csv --commit
```

---

## Pipeline xử lý

```
data/users.csv
    ↓
parser.ts       → Đọc file, strip BOM, normalize newlines
                  → Trả về Result<RawCsvRow[], string>
    ↓
validator.ts    → Validate từng row theo 3 rules:
                  name không rỗng | email đúng định dạng | age >= 0
                  → Tách thành accepted[] và rejected[]
    ↓
db.ts           → Connection Pool (10 connections)
                  → INSERT IGNORE INTO users (nếu --commit)
    ↓
exports/        → Ghi rejected.csv + report.json
```

---

## Validation Rules (`src/validator.ts`)

| Field | Rule | Lỗi trả về |
|---|---|---|
| `name` | Không được rỗng sau khi trim | `Tên (name) không được để trống` |
| `email` | Phải khớp regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `Email sai định dạng: <value>` |
| `age` | Nếu có giá trị: phải là số nguyên `>= 0` | `Tuổi (age) không hợp lệ: <value>` |

> `age` là tuỳ chọn — nếu bỏ trống thì mặc định là `0`, không báo lỗi.

---

## Output mẫu

### Console

```
✅ Đã kết nối MySQL (cli_manager) thành công!
📂 Bắt đầu xử lý file: data/users.csv
--- Đang ghi dữ liệu vào MySQL ---
✅ Hoàn thành!
┌──────────┬────────┐
│ total    │ 50     │
│ accepted │ 47     │
│ rejected │ 3      │
│ duration │ 0.84s  │
└──────────┴────────┘
```

### `exports/report.json`

```json
{
  "summary": {
    "total": 50,
    "accepted": 47,
    "rejected": 3,
    "duration": "0.84s"
  },
  "timestamp": "2026-01-07T10:00:00.000Z"
}
```

### `exports/rejected.csv`

```
name,email,age,_reason
Le Van C,,24,Email sai định dạng:
,d.pham@example.com,29,Tên (name) không được để trống
Nguyen X,notanemail,abc,Email sai định dạng: notanemail
```

---

## Kiến trúc các module

### `src/parser.ts` — CSV Parser

```typescript
export async function parseCSV(filePath: string): Promise<Result<RawCsvRow[], string>>
```

- Strip BOM (`\uFEFF`) ở đầu file
- Normalize newlines (`\r\n` → `\n`)
- Tách header từ dòng đầu, map các dòng còn lại thành `RawCsvRow`
- Trả về `Result<T,E>` — không bao giờ throw

### `src/validator.ts` — Row Validator

```typescript
export function validateRow(row: RawCsvRow): { isValid: boolean; data?: ValidUserData; reason?: string }
```

- Nhận `RawCsvRow` (dữ liệu thô)
- Trả về object có `isValid`, `data` (nếu hợp lệ) hoặc `reason` (nếu lỗi)

### `src/db.ts` — MySQL Connection Pool

```typescript
const pool = mysql.createPool({ connectionLimit: 10, ... });
export default pool;
```

- Pool tối đa **10 kết nối** đồng thời
- Test kết nối ngay khi module được import
- Dùng `pool.end()` ở cuối `main()` để đóng sạch

### `src/result.ts` — Result\<T,E\>

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

ok(value)   // → { ok: true, value }
err(error)  // → { ok: false, error }
```

---

## Tổng hợp các lệnh

| Lệnh | Mô tả |
|---|---|
| `pnpm dev` | Chạy nhanh với file mặc định `data/users.csv --commit` |
| `pnpm build` | Build TypeScript → `dist/` |
| `ts-node src/index.ts --file <path> --dry-run` | Mô phỏng pipeline, không ghi DB |
| `ts-node src/index.ts --file <path> --commit` | Chạy thật, ghi vào MySQL |
| `mysql -u root -p < schema.sql` | Khởi tạo database và bảng |

---



## Kiến thức đã học

| Chủ đề | Nội dung |
|---|---|
| MySQL Connection Pool | `mysql2/promise`, `connectionLimit`, `pool.end()` |
| `INSERT IGNORE` | Bỏ qua duplicate thay vì báo lỗi — nhờ `UNIQUE KEY` trên `email` |
| `Result<T,E>` pattern | Không dùng `throw`, caller buộc phải xử lý cả 2 trường hợp |
| `performance.now()` | Đo thời gian thực thi chính xác đến millisecond |
| DTO pattern | `RawCsvRow` → `ValidUserData` → DB insert |
| CLI argument parsing | `process.argv.indexOf()` + `process.argv.includes()` |
| Pipeline pattern | Mỗi bước (parse → validate → insert → export) có trách nhiệm rõ ràng |