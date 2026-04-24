import { randomUUID } from 'crypto';
import logger from '../config/logger.js';

export function requestLogger(req, res, next) {
  // Lấy từ header nếu client gửi lên, không thì tự sinh
  req.traceId = req.headers['x-trace-id'] || randomUUID();
  
  // Gắn vào response header để client cũng biết traceId
  res.setHeader('x-trace-id', req.traceId);
  // Lưu thời điểm request bắt đầu
  const start = Date.now();

  // res.on('finish'): chạy SAU KHI response được gửi đi
  // Lúc này mới biết statusCode và thời gian xử lý
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    const meta = { traceId: req.traceId };

    // Nếu status >= 400 → log là warn, >= 500 → log là error
    // Còn lại → log là info
    if (res.statusCode >= 500) {
      logger.error(message, meta);
    } else if (res.statusCode >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  });

  next();
}