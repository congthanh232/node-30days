# Ngày 3 — File System (fs/path) + JSON/CSV

Tổng hợp 5 bài tập thực tế về đọc/ghi file, xử lý CSV, và quản lý thư mục output trong Node.js.

---

## Cấu trúc project

```
day3/
├── bt1-log-archiver/
│   ├── logs/
│   │   ├── app-2026-04-9.log
│   │   └── app-2027-04-9.log
│   ├── exports/          ← tự động tạo khi chạy
│   │   └── logs-summary.json
│   └── index.js
├── bt2-csv-parser/       ← chứa BT2, BT3, BT4, BT5
│   ├── exports/          ← tự động tạo khi chạy
│   │   └── rejected.csv
│   ├── data.csv
│   └── index.js
└── package.json
```

> **Lưu ý:** BT3, BT4, BT5 được mở rộng dần từ BT2 nên nằm chung trong thư mục `bt2-csv-parser`.

---

## Yêu cầu

- Node.js đã cài đặt
- `package.json` có `"type": "module"` để dùng ESM (`import/export`)

---

## BT1 — Log Archiver

**Mục tiêu:** Đọc tất cả file trong `./logs`, đếm số dòng theo ngày, xuất ra `./exports/logs-summary.json`.

**Lệnh chạy:**
```bash
node bt1-log-archiver/index.js
```

**Kết quả mong đợi:** File `bt1-log-archiver/exports/logs-summary.json` được tạo ra với nội dung:
```json
{
  "2026-04-9": 3,
  "2027-04-9": 3
}
```

---

## BT2 — CSV Parser chịu lỗi

**Mục tiêu:** Đọc `data.csv`, bỏ qua dòng trống, trim whitespace, tách dòng hợp lệ và dòng lỗi, ghi dòng lỗi ra `./exports/rejected.csv`.

**Cột bắt buộc:** `name`, `email`

**Lệnh chạy:**
```bash
node bt2-csv-parser/index.js
```

**Kết quả mong đợi:**
- In ra màn hình danh sách `Valid` và `Rejected`
- File `bt2-csv-parser/exports/rejected.csv` được tạo ra chứa các dòng thiếu cột bắt buộc

---

## BT3 — Dry-run Flag

**Mục tiêu:** Thêm flag `--dry-run` để chạy thử mà không ghi file — chỉ in kết quả ra màn hình.

**Lệnh chạy bình thường** (có ghi file):
```bash
node bt2-csv-parser/index.js
```

**Lệnh chạy dry-run** (không ghi file):
```bash
node bt2-csv-parser/index.js --dry-run
```

**Kết quả mong đợi khi dùng `--dry-run`:**
```
[DRY-RUN] Sẽ ghi rejected.csv với nội dung:
name,email,age,_reason
Le Van C,,24.0,Thiếu: email
...
```

---

## BT4 — Hỗ trợ Encoding

**Mục tiêu:** Xử lý file CSV có BOM (UTF-8-BOM từ Excel) và chuẩn hóa newline `\r\n` → `\n` trước khi parse.

**Lệnh chạy:** (tích hợp sẵn trong BT2, không cần flag riêng)
```bash
node bt2-csv-parser/index.js
```

**Cách hoạt động:** Trước khi parse, code tự động:
1. Bỏ BOM nếu có ở đầu file
2. Chuyển `\r\n` (Windows) về `\n` (Unix)

---

## BT5 — Max Errors (Quality Gate)

**Mục tiêu:** Thêm option `--max-errors N` để dừng chương trình khi số dòng lỗi vượt ngưỡng N.

**Lệnh chạy:**
```bash
node bt2-csv-parser/index.js --max-errors 2
```

**Kết quả mong đợi** (với `data.csv` có 3 dòng lỗi):
```
Dừng: vượt ngưỡng 2 lỗi
```

**Kết hợp với dry-run:**
```bash
node bt2-csv-parser/index.js --dry-run --max-errors 2
```

---

## Tổng hợp các lệnh

| Lệnh | Mô tả |
|------|-------|
| `node bt1-log-archiver/index.js` | Chạy BT1 — tạo logs-summary.json |
| `node bt2-csv-parser/index.js` | Chạy BT2/BT4 — parse CSV, tạo rejected.csv |
| `node bt2-csv-parser/index.js --dry-run` | Chạy BT3 — xem trước, không ghi file |
| `node bt2-csv-parser/index.js --max-errors N` | Chạy BT5 — dừng khi quá N lỗi |
| `node bt2-csv-parser/index.js --dry-run --max-errors N` | Kết hợp BT3 + BT5 |