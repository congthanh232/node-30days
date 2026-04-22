import AppError from '../errors/AppError.js';
import { register, login } from '../services/auth.service.js';

export async function registerController(req, res, next) {
  try {
    // Tạo meta từ request — truyền sang service để ghi activity log
    const meta = { ip: req.ip };

    const user = await register(req.body, meta);
    res.json({
      message: 'Register thành công',
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

export async function loginController(req, res, next) {
  try {
    // Tạo meta từ request — truyền sang service để ghi activity log
    const meta = { ip: req.ip };

    const token = await login(req.body, meta);
    if (!token) {
      return next(new AppError({
        code: 'INVALID_CREDENTIALS',
        message: 'Email hoặc password sai',
        status: 401
      }));
    }
    const client = req.headers['x-client']; // 'app' | 'web' | undefined

    if (client === 'app') {
      // app cần refresh token để tự động đăng nhập lại
      return res.json({
        accessToken: token,
        refreshToken: 'fake-refresh-token', // sau này làm thật
      });
    }
    res.json({ accessToken: token });
  } catch (err) {
    next(err);
  }
}