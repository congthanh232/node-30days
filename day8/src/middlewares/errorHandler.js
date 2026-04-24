import AppError  from '../errors/AppError.js';
import logger from '../config/logger.js';
import { notifyError } from '../config/telegram.js';
import { sendError } from '../utils/response.js';

export default function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  // lấy ID đã sinh từ requestLogger
  const traceId = req.traceId;

  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, { traceId });

  // Lỗi có kiểm soát — không gửi Telegram
  if (err instanceof AppError) {
    return sendError(res, {
      status: err.status,
      code: err.code,
      message: err.message,
      details: err.details,
      traceId,

    });

  }

  // Chỉ gửi Telegram khi lỗi 500 — tức là bug thật sự trong code
  // void để không block response, fire-and-forget
  void notifyError(err, req);
  // Nếu là lỗi bất ngờ (bug, lỗi không lường trước)
  // thì không lộ chi tiết ra ngoài
  return sendError(res, {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Internal Server Error',
    details: isProduction ? [] : [{ stack: err.stack }],
    traceId,
  });

}