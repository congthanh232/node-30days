# Ngày 4 — Streams + Xử lý file lớn

Tổng hợp 5 bài tập thực tế về đọc file bằng Stream, xử lý CSV lớn, và benchmark hiệu năng trong Node.js.

---

## Cấu trúc project

```
day4/
├── bt1-csv-stats/
│   ├── sample.csv
│   └── index.js
├── bt2-split-file/
│   └── index.js
├── bt3-options/
│   ├── output/           ← tự động tạo khi chạy
│   └── index.js
├── bt4-pipeline/
│   └── index.js
├── bt5-benchmark/
│   ├── generate.js       ← tạo file lớn để test
│   ├── big.csv           ← tự động tạo khi chạy generate.js
│   ├── report.json       ← tự động tạo khi chạy
│   └── index.js
└── package.json
```

---

## Yêu cầu

- Node.js đã cài đặt
- `package.json` có `"type": "module"` để dùng ESM (`import/export`)

---

## BT1 — CSV Stats

**Mục tiêu:** Đọc file CSV bằng stream, đếm dòng, tính top 5 domain email, tỉ lệ dòng lỗi.

**Lệnh chạy:**
```bash
node bt1-csv-stats/index.js bt1-csv-stats/sample.csv
```

**Kết quả mong đợi:**
```
Tổng dòng dữ liệu: 8
Dòng lỗi: 2 (25.00%)
Top 5 domain:
  1. gmail.com: 3 lần
  2. yahoo.com: 2 lần
  3. outlook.com: 1 lần
```

---

## BT2 — Split File

**Mục tiêu:** Cắt 1 file CSV lớn thành nhiều file nhỏ, mỗi file N dòng, giữ header ở đầu mỗi file.

**Lệnh chạy:**
```bash
node bt2-split-file/index.js <file.csv> <số dòng/file>
```

**Ví dụ:**
```bash
node bt2-split-file/index.js bt1-csv-stats/sample.csv 3
# Tạo ra: part_1.csv, part_2.csv, part_3.csv
```

---

## BT3 — Options

**Mục tiêu:** Mở rộng BT2 với `--chunk-size` và `--output-dir`, đảm bảo không ghi đè file cũ.

**Lệnh chạy:**
```bash
node bt3-options/index.js <file.csv> --chunk-size <N> --output-dir <thư mục>
```

**Ví dụ:**
```bash
node bt3-options/index.js bt1-csv-stats/sample.csv --chunk-size 3 --output-dir ./output
```

**Tính năng:**
- Tự động tạo `--output-dir` nếu chưa tồn tại
- Chạy nhiều lần không ghi đè — tự động đặt tên tiếp theo (`part_4`, `part_5`...)

---

## BT4 — Pipeline + Xử lý lỗi

**Mục tiêu:** Dùng `pipeline()` để đọc file, xử lý lỗi chuẩn — in ra `stderr` và trả exit code khác 0 khi thất bại.

**Lệnh chạy:**
```bash
node bt4-pipeline/index.js <file.csv>
```

**Kết quả khi thành công:**
```
Dòng 1: id,name,email,age
...
Tổng: 9 dòng
```

**Kết quả khi file không tồn tại:**
```
Lỗi: ENOENT: no such file or directory
# exit code = 1
```

---

## BT5 — Benchmark

**Mục tiêu:** Đo hiệu năng xử lý file lớn (>=100MB), ghi `durationMs` và `memoryUsage` trước/sau vào `report.json`.

**Tạo file lớn để test:**
```bash
node bt5-benchmark/generate.js
# Tạo big.csv ~128MB với 3 triệu dòng
```

**Chạy benchmark:**
```bash
node bt5-benchmark/index.js bt5-benchmark/big.csv
```

**Kết quả mong đợi:**
```
Done! 3000001 dòng trong 197ms
```

**Nội dung `report.json`:**
```json
{
  "file": "big.csv",
  "fileSizeMB": 128.43,
  "lineCount": 3000001,
  "durationMs": 197,
  "memoryBefore": { "rssMB": 34.43, "heapUsedMB": 4.59 },
  "memoryAfter": { "rssMB": 51.35, "heapUsedMB": 6.79 }
}
```

---

## Tổng hợp các lệnh

| Lệnh | Mô tả |
|------|-------|
| `node bt1-csv-stats/index.js <file>` | Thống kê CSV — đếm dòng, domain, lỗi |
| `node bt2-split-file/index.js <file> <N>` | Cắt CSV thành nhiều file N dòng |
| `node bt3-options/index.js <file> --chunk-size <N> --output-dir <dir>` | Cắt CSV với options, không ghi đè |
| `node bt4-pipeline/index.js <file>` | Đọc file bằng pipeline, xử lý lỗi chuẩn |
| `node bt5-benchmark/generate.js` | Tạo file CSV lớn để test |
| `node bt5-benchmark/index.js <file>` | Benchmark + ghi report.json |
