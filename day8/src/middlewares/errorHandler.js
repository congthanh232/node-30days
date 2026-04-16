import AppError  from '../errors/AppError.js';

export default function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);  
  
  // Nếu là AppError thì dùng thông tin từ đó
  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      details: err.details,
      traceId: err.traceId,
    });
  }

  // Nếu là lỗi bất ngờ (bug, lỗi không lường trước)
  // thì không lộ chi tiết ra ngoài
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Internal Server Error',
    details: [],
    traceId: crypto.randomUUID(),
  });
}