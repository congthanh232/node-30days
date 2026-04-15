# Ngày 6 — TypeScript cho Node.js (strict mode) + Cấu trúc project

Tổng hợp 5 bài tập thực tế về TypeScript: refactor sang TS, typed config, Result type, strict mode nâng cao, và tách types theo DTO pattern.

---

## Cấu trúc project

```
day6/
├── src/
│   ├── types/
│   │   └── csv.ts          ← DTO types dùng chung (BT5)
│   ├── config.ts           ← Typed app config, đọc từ .env (BT2)
│   ├── result.ts           ← Generic Result<T,E> type + helpers (BT3)
│   ├── index.ts            ← CSV parser refactor sang TypeScript (BT1)
│   └── test-config.ts      ← Test thử config có đọc được .env không
├── dist/                   ← Output JS sau khi build (tự động tạo)
├── data.csv                ← File dữ liệu đầu vào
├── .env                    ← Environment variables
├── tsconfig.json           ← Cấu hình TypeScript compiler
└── package.json
```

---

## Yêu cầu

- Node.js đã cài đặt
- Cài dependencies:

```bash
npm install dotenv
npm install --save-dev typescript @types/node
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "bundler",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*"]
}
```

---

## BT1 — Refactor CSV Parser sang TypeScript

**Mục tiêu:** Chuyển tool parse CSV từ ngày 3 (JavaScript) sang TypeScript, thêm type annotations đầy đủ.

**Những thay đổi chính so với bản JS:**

| Trước (JS) | Sau (TS) |
|---|---|
| `function stripBOM(str)` | `function stripBOM(str: string): string` |
| `const valid = []` | `const valid: ValidRow[] = []` |
| `const rejected = []` | `const rejected: RejectedRow[] = []` |
| Dùng `import.meta.url` (ESM) | Dùng `__dirname` (CommonJS) |
| Không xử lý lỗi đọc file | Wrap bằng `Result<T,E>` |

**Build và chạy:**

```bash
npx tsc
node dist/index.js

# Với các options:
node dist/index.js --dry-run
node dist/index.js --max-errors 2
```

**Kết quả mẫu:**
```
Valid: [
  { name: 'Nguyen Van A', email: 'a.nguyen@example.com', age: '28.0' },
  { name: 'Tran Thi B', email: 'b.tran@example.com', age: '32.0' },
]
Rejected: [
  { name: 'Le Van C', email: '', age: '24.0', _reason: 'Thiếu: email' },
  { name: '', email: 'd.pham@example.com', age: '29.0', _reason: 'Thiếu: name' },
]
```

---

## BT2 — Typed Config (`src/config.ts`)

**Mục tiêu:** Tập trung config vào 1 file duy nhất, có type đầy đủ, đọc từ `.env`.

**File `.env`:**
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
UPLOAD_PATH=./uploads
LOG_PATH=./logs
```

**Type:**
```typescript
type AppConfig = {
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
  };
  paths: {
    uploads: string;
    logs: string;
  };
};
```

**Dùng ở file khác:**
```typescript
import { config } from './config';
config.port       // → number, có autocomplete
config.db.host    // → string, có autocomplete
```

**Test config:**
```bash
npx tsc
node dist/test-config.js
# → Port: 3000
# → DB Host: localhost
# → DB Name: myapp
# → Uploads path: ./uploads
```

---

## BT3 — Result\<T, E\> (`src/result.ts`)

**Mục tiêu:** Thay vì `throw` error, dùng `Result<T,E>` để buộc caller phải xử lý cả 2 trường hợp thành công và thất bại.

**Type:**
```typescript
type Result<T, E> =
  | { ok: true;  value: T }
  | { ok: false; error: E };
```

**Helper functions:**
```typescript
ok(value)   // → { ok: true, value }
err(error)  // → { ok: false, error }
```

**Ví dụ dùng trong index.ts:**
```typescript
// Đọc file — không crash, trả về Result
async function readFile(filePath: string): Promise<Result<string, string>> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return ok(content);
  } catch {
    return err(`Không tìm thấy file: ${filePath}`);
  }
}

// Caller buộc phải xử lý cả 2 trường hợp
const result = await readFile(filePath);
if (!result.ok) {
  console.error(result.error);
  process.exit(1);
}
let content = result.value; // TypeScript biết chắc đây là string
```

---

## BT4 — Strict Mode nâng cao

**Mục tiêu:** Bật thêm 2 strict options và fix các lỗi phát sinh.

**Thêm vào tsconfig.json:**
```json
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true
```

**Lỗi phát sinh và cách fix:**

| Lỗi | Nguyên nhân | Fix |
|---|---|---|
| `process.argv[idx+1]` có thể `undefined` | `noUncheckedIndexedAccess` — array access luôn có thể undefined | Check `if (val === undefined)` trước khi dùng |
| `lines[0]` có thể `undefined` | File CSV có thể rỗng | Check `if (firstLine === undefined)` rồi exit |
| `rejected[0]` có thể `undefined` | Array có thể rỗng | Check `rejected.length === 0` và `if (first === undefined)` |

---

## BT5 — Tách Types (`src/types/csv.ts`)

**Mục tiêu:** Tập trung tất cả types vào folder `types/`, phân biệt rõ input và output type.

```typescript
// Input — row thô đọc từ CSV, chưa validate
export type RawCsvRow = Record<string, string>;

// Output — row hợp lệ
export type ValidRow = Record<string, string>;

// Output — row bị reject, có thêm lý do
export type RejectedRow = RawCsvRow & { _reason: string };

// Utility — kết quả parse toàn bộ file
export type ParseResult = {
  valid: ValidRow[];
  rejected: RejectedRow[];
};
```

**Dùng trong index.ts:**
```typescript
import { RawCsvRow, ValidRow, RejectedRow } from './types/csv';

const row: RawCsvRow = Object.fromEntries(...);
const valid: ValidRow[] = [];
const rejected: RejectedRow[] = [];
```

---

## Tổng hợp các lệnh

| Lệnh | Mô tả |
|---|---|
| `npx tsc` | Build TypeScript → JavaScript vào `dist/` |
| `node dist/index.js` | Chạy CSV parser |
| `node dist/index.js --dry-run` | Chạy không ghi file |
| `node dist/index.js --max-errors 2` | Dừng sau 2 lỗi |
| `node dist/test-config.js` | Kiểm tra config đọc từ .env |

---

## Kiến thức đã học

| Chủ đề | Nội dung |
|---|---|
| `tsconfig.json` | `target`, `module`, `moduleResolution`, `strict`, `outDir`, `rootDir` |
| `type` vs `interface` | `type` cho union/intersection, `interface` cho object shape |
| Generics | `Result<T,E>`, `Record<string, string>` |
| Utility types | `Pick`, `Omit`, `Partial`, `Record`, `ReturnType` |
| Strict mode | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| DTO pattern | Tách input type vs output type, dùng chung qua `types/` folder |