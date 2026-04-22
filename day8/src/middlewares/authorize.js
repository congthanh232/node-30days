// src/middlewares/authorize.js
import AppError from '../errors/AppError.js';

// authorize nhận vào danh sách role được phép
// Ví dụ: authorize('admin') → chỉ admin được vào
//        authorize('admin', 'member') → cả 2 được vào
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // req.user được gắn bởi authenticate middleware trước đó
    // Nếu không có req.user → authenticate chưa chạy → lỗi
    if (!req.user) {
      return next(new AppError({
        code: 'UNAUTHORIZED',
        message: 'Chưa xác thực',
        status: 401,
      }));
    }

    const { role } = req.user;

    // Kiểm tra role của user có nằm trong danh sách được phép không
    if (!allowedRoles.includes(role)) {
      return next(new AppError({
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền truy cập',
        status: 403,
      }));
    }

    next();
  };
}