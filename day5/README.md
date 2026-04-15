# Ngày 5 — EventEmitter + HTTP thuần Node

Tổng hợp 5 bài tập thực tế về EventEmitter (pub/sub pattern) và HTTP server không dùng framework.

---

## Cấu trúc project

```
day5/
├── bt1-log-bus/
│   ├── bus.js            ← EventEmitter trung tâm
│   ├── logger.js         ← listener ghi file JSONL
│   ├── importer.js       ← giả lập import, emit event
│   └── logs/
│       └── import.jsonl  ← tự động tạo khi chạy
└── bt2-http-server/
    └── server.js         ← HTTP server (BT2 → BT5 dồn vào đây)
```

---

## Yêu cầu

- Node.js đã cài đặt
- `package.json` có `"type": "module"` để dùng ESM (`import/export`)

---

## BT1 — Mini Log Bus

**Mục tiêu:** Dùng EventEmitter làm pub/sub bus, listener tự động ghi log ra file JSONL.

**Events:**
| Event | Loại | Mô tả |
|---|---|---|
| `import.started` | `once` | Bắt đầu import |
| `import.rowAccepted` | `on` | Một dòng hợp lệ |
| `import.rowRejected` | `on` | Một dòng lỗi |
| `import.finished` | `once` | Kết thúc import |

**Lệnh chạy:**
```bash
node bt1-log-bus/importer.js
```

**Kết quả — `logs/import.jsonl`:**
```jsonl
{"event":"import.started","timestamp":"...","data":{"file":"data.csv"}}
{"event":"import.rowAccepted","timestamp":"...","data":{"row":1,"name":"Alice"}}
{"event":"import.rowRejected","timestamp":"...","data":{"row":2,"reason":"missing email"}}
{"event":"import.rowAccepted","timestamp":"...","data":{"row":3,"name":"Bob"}}
{"event":"import.finished","timestamp":"...","data":{"total":3,"accepted":2,"rejected":1}}
```

---

## BT2 — HTTP Server (3 endpoints)

**Mục tiêu:** HTTP server thuần Node, không dùng Express.

| Endpoint | Method | Mô tả |
|---|---|---|
| `/health` | GET | Kiểm tra server còn sống |
| `/echo` | POST | Nhận JSON và trả lại |
| `/metrics` | GET | Số request theo từng route |

**Lệnh chạy:**
```bash
node bt2-http-server/server.js
```

**Test bằng curl:**
```bash
curl http://localhost:3000/health
# → {"status":"ok"}

curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
# → {"name":"Alice"}

curl http://localhost:3000/metrics
# → {"/health":1,"/echo":1,"/metrics":1}
```

---

## BT3 — RequestId + Logging

**Mục tiêu:** Thêm `requestId` và log mỗi request ra console.

**Log format:**
```
[req-1] GET /health 200 2ms
[req-2] POST /echo 200 5ms
[req-3] GET /metrics 200 1ms
```

---

## BT4 — Timeout + Body Size Limit

**Mục tiêu:** Bảo vệ `/echo` khỏi payload quá lớn và request quá chậm.

| Trường hợp | Status | Response |
|---|---|---|
| Body > 1KB | `413` | `{"error":"Payload too large"}` |
| Không nhận đủ body sau 5s | `408` | `{"error":"Request timeout"}` |

**Test payload quá lớn:**
```bash
# Tạm giảm MAX_BODY_SIZE = 10 để test nhanh
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
# → {"error":"Payload too large"}
```

---

## BT5 — Graceful Shutdown

**Mục tiêu:** Tắt server sạch sẽ khi nhận `SIGINT` (Ctrl+C) hoặc `SIGTERM`.

**Kết quả khi nhấn Ctrl+C:**
```
^C
Shutting down...
Server closed
```

---

## Tổng hợp các lệnh

| Lệnh | Mô tả |
|---|---|
| `node bt1-log-bus/importer.js` | Chạy giả lập import, ghi log JSONL |
| `node bt2-http-server/server.js` | Khởi động HTTP server trên port 3000 |