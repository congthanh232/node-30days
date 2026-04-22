import rateLimit from 'express-rate-limit';


// Tạo function trả về response chuẩn khi bị rate limit
const createLimitHandler = (message) => (req, res) => {
    res.status(429).json({
        success: false,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message,
        },
    });
};

// Mục tiêu: chặn brute-force password
// Mỗi IP chỉ được gọi /login tối đa 5 lần trong 15 phút
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút (milliseconds)
  max: 5,                    // tối đa 5 request trong windowMs

  // standardHeaders: true → tự động thêm vào response:
  // RateLimit-Limit: 5          (tổng số lần được phép)
  // RateLimit-Remaining: 4      (còn lại bao nhiêu lần)
  // RateLimit-Reset: 1234567890 (reset lúc mấy giờ)
  standardHeaders: true,

  // legacyHeaders: false → tắt header cũ X-RateLimit-* (không cần thiết)
  legacyHeaders: false,

  // handler: chạy khi IP vượt quá giới hạn
  handler: createLimitHandler(
    'Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút.'
  ),
});

// ─── GENERAL LIMITER ─────────────────────────────────────────────────────────
// Mục tiêu: chặn spam toàn bộ API
// Mỗi IP tối đa 100 request trong 15 phút
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createLimitHandler('Quá nhiều request. Vui lòng thử lại sau.'),
});