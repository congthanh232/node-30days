# 🚀 Day 2: Advanced Asynchronous & Error Handling

Day 2 tập trung vào các kỹ năng xử lý bất đồng bộ nâng cao và các Pattern kiểm soát lỗi (Error Handling) .

## 📂 Cấu trúc thư mục (Folder Structure):

```text
day2/
├── scripts/                 # Chứa các kịch bản chạy thử (Entry points)
│   ├── ping-urls.js         # Kịch bản test Concurrency Limit (BT2)
│   └── run-circuit.js       # Kịch bản test Circuit Breaker (BT5)
├── test/                    # Chứa Unit Test bằng Vitest (BT3)
│   ├── concurrency.test.js
│   └── retry.test.js
├── utils/                   # Chứa logic lõi (Core logic)
│   ├── circuit-breaker.js   # Hàm tạo Cầu dao tự ngắt (BT5)
│   ├── concurrency.js       # Hàm giới hạn xử lý song song (BT2)
│   └── retry.js             # Hàm thử lại tích hợp Backoff & Jitter (BT1, BT4)
└── README.md                # File hướng dẫn này
```
## 2. Hướng dẫn chạy từng bài tập
```text
Bài 1 & Bài 4: Retry Pattern + Exponential Backoff & Jitter.
Lệnh chạy:

pnpm run test test/retry.test.js

Bài 2: Viết tool “ping url” (không cần axios): dùng fetch gọi 10 URL, limit concurrency = 3, in bảng kết quả (ok/fail + latency).
Lệnh chạy:

node scripts/ping-urls.js

bài 3: Tạo test tối thiểu cho retry và concurrency limiter (Jest/Vitest tuỳ chọn).
Lệnh chạy:

pnpm run test .\test\concurrency.test.js
hoặc 
pnpm run test
```



