import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// ─── FORMAT ──────────────────────────────────────────────────────────────────
// format.combine: kết hợp nhiều format lại với nhau
const logFormat = winston.format.combine(
  // timestamp: thêm thời gian vào mỗi log
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),

  // printf: tự định nghĩa format log trông như thế nào
  winston.format.printf(({ timestamp, level, message, traceId }) => {
    // Nếu có traceId thì hiện, không thì để trống
    const trace = traceId ? `[${traceId}]` : '[no-trace]';
    return `[${timestamp}] ${level.toUpperCase().padEnd(5)} ${trace} ${message}`;
  })
);

// ─── TRANSPORTS ──────────────────────────────────────────────────────────────
// Transport = nơi log được ghi vào
// Có thể có nhiều transport cùng lúc → log ra nhiều nơi

// 1. Ghi ra terminal (console)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(), // màu sắc cho dễ đọc ở terminal
    logFormat
  ),
});

// 2. Ghi ra file theo ngày
const fileTransport = new DailyRotateFile({
  dirname: 'logs',                    // thư mục chứa file log
  filename: '%DATE%.log',             // tên file: 2026-04-22.log
  datePattern: 'YYYY-MM-DD',          // format ngày trong tên file
  maxFiles: '14d',                    // giữ log tối đa 14 ngày, cũ hơn tự xóa
  format: logFormat,
});

// ─── LOGGER ──────────────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // log từ level info trở lên (info, warn, error)
  transports: [consoleTransport, fileTransport],
});

export default logger;