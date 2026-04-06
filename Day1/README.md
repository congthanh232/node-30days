# 🚀 Node.js 30 Days - Day 1: Backend Boilerplate

Dự án thiết lập nền tảng Backend chuẩn doanh nghiệp, hỗ trợ đa môi trường và kiểm soát chất lượng code tự động.

## 1. Yêu cầu hệ thống (Prerequisites)
Để chạy được dự án này, máy tính của bạn cần cài đặt sẵn:
- **Node.js**: Phiên bản v20 trở lên.
- **Package Manager**: `pnpm` (v10+).

## 2. Hướng dẫn cài đặt (Installation)
Chạy lần lượt các lệnh sau trong Terminal để tải dự án về máy:

```bash
# 1. Clone dự án từ GitHub
git clone [https://github.com/congthanh232/node-30days.git](https://github.com/congthanh232/node-30days.git)

# 2. Di chuyển vào thư mục Ngày 1
cd node-30days/Day1

# 3. Cài đặt các thư viện cần thiết
pnpm install
```

## 3. Cấu hình Két Sắt (Environment Setup) ⚠️ QUAN TRỌNG
Dự án không đính kèm sẵn cấu hình mật khẩu. Bạn bắt buộc phải tạo các file biến môi trường riêng cho từng mục đích sử dụng.

Hãy copy file mẫu `.env.example` và tạo thành 3 file mới nằm trong thư mục `Day1`:
- Tạo file **`.env.development`** (Môi trường code): Điền `PORT=3000`
- Tạo file **`.env.staging`** (Môi trường test): Điền `PORT=5000`
- Tạo file **`.env.production`** (Môi trường thật): Điền `PORT=8888`

## 4. Hướng dẫn chạy dự án (Usage)
Sau khi đã có đủ các file `.env` ở trên, bạn dùng các lệnh sau để chạy:

| Lệnh | Môi trường | File Két Sắt được dùng |
| :--- | :--- | :--- |
| `pnpm dev` | Chạy lúc code (Tự reload) | Mở file `.env.development` |
| `pnpm run staging` | Chạy máy chủ Test | Mở file `.env.staging` |
| `pnpm run prod` | Chạy máy chủ Thật | Mở file `.env.production` |

> **Lưu ý:** Lệnh `pnpm dev` đã được tích hợp sẵn lớp bảo vệ. Nếu bạn quên tạo file `.env.development` hoặc quên khai báo biến `PORT`, hệ thống sẽ tự động chặn và báo lỗi màu đỏ.

## 5. Các lệnh hỗ trợ khác
- `pnpm run lint`: Quét và báo lỗi cú pháp trong code.
- `pnpm run format`: Tự động format, làm đẹp code cho chuẩn.