// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export function authenticate(req, res, next) {
  // Lấy token từ header Authorization
  // Format: "Bearer eyJhbGci..."
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(new AppError({
      code: 'UNAUTHORIZED',
      message: 'Không có token',
      status: 401,
    }));
  }

  // Tách "Bearer " ra khỏi token
  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError({
      code: 'UNAUTHORIZED',
      message: 'Token không hợp lệ',
      status: 401,
    }));
  }

  try {
    // Decode token → lấy ra userId và role
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gắn vào req để các middleware/controller sau dùng
    // req.user = { userId: 1, role: 'member' }
    req.user = decoded;

    next();
  } catch (err) {
    return next(new AppError({
      code: 'UNAUTHORIZED',
      message: 'Token hết hạn hoặc không hợp lệ',
      status: 401,
    }));
  }
}