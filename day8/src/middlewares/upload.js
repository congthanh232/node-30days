import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../errors/AppError.js';

const uploadDir = 'uploads/originals';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // AppError thay vì Error thường
    cb(new AppError({
      code: 'INVALID_FILE_TYPE',
      message: `Chỉ chấp nhận file: ${ALLOWED_TYPES.join(', ')}`,
      status: 400,
    }));
  }
};

// Wrapper bắt lỗi multer → convert sang AppError
const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

export function upload(fieldName) {
  return (req, res, next) => {
    multerUpload.single(fieldName)(req, res, (err) => {
      if (!err) return next(); // không có lỗi → đi tiếp

      // Multer báo vượt file size
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError({
          code: 'FILE_TOO_LARGE',
          message: `File quá lớn, tối đa ${MAX_SIZE_MB}MB`,
          status: 400,
        }));
      }

      // AppError từ fileFilter
      if (err instanceof AppError) return next(err);

      // Lỗi khác không lường trước
      return next(new AppError({
        code: 'UPLOAD_FAILED',
        message: 'Upload thất bại',
        status: 400,
      }));
    });
  };
}