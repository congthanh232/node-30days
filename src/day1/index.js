//Xác định môi trường đang chạy
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT;

// Validate tối thiểu (Kiểm tra xem có bị thiếu không)

if (!port) {
  console.error(
    '❌ [LỖI NGHIÊM TRỌNG]: Chưa khai báo biến PORT trong file .env!'
  );

  // exit(1) là báo cho hệ điều hành biết: Ứng dụng này bị lỗi, hãy ép nó dừng lại ngay!
  process.exit(1);
}

console.log(`✅ [THÀNH CÔNG]: Khởi động ứng dụng tại Port: ${port}`);
console.log(`🌍 Môi trường hiện tại: ${env}`);
