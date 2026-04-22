import AppError  from '../errors/AppError.js';
import logger from '../config/logger.js';
import { notifyError } from '../config/telegram.js';

export default function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`); 
   const isProduction = process.env.NODE_ENV === 'production';
   

  // Nếu là AppError thì dùng thông tin từ đó
  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      details: err.details,
      traceId: err.traceId,
    });
  }

  // Chỉ gửi Telegram khi lỗi 500 — tức là bug thật sự trong code
  // void để không block response, fire-and-forget
  void notifyError(err, req);
  // Nếu là lỗi bất ngờ (bug, lỗi không lường trước)
  // thì không lộ chi tiết ra ngoài
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Internal Server Error',
    details: [],
    traceId: crypto.randomUUID(),

    // stack: chỉ hiện khi development để debug
    ...(isProduction ? {} : { stack: err.stack }),
  });
}