// src/middlewares/requestLogger.js
import logger from '../config/logger.js';

export function requestLogger(req, res, next) {
  // Lưu thời điểm request bắt đầu
  const start = Date.now();

  // res.on('finish'): chạy SAU KHI response được gửi đi
  // Lúc này mới biết statusCode và thời gian xử lý
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;

    // Nếu status >= 400 → log là warn, >= 500 → log là error
    // Còn lại → log là info
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
}