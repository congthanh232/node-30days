import AppError from '../errors/AppError.js';
import { register, login, createUser } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
export async function registerController(req, res, next) {
  try {
    // Tạo meta từ request — truyền sang service để ghi activity log
    const meta = { ip: req.ip };

    const user = await register(req.body, meta);
    sendSuccess(res, {
      status: 201,
      message: 'Register thành công',
      data: { id: user.id, email: user.email }
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
      return sendSuccess(res, {
        message: 'Login thành công',
        data: { accessToken: token }
      });
    }

    // default web
    sendSuccess(res, {
      message: 'Login thành công',
      data: { accessToken: token }
    });
  } catch (err) {
    next(err);
  }
}

export async function createUserController(req, res, next) {
  try {
    const { role: callerRole, userId: callerId } = req.user;
    const meta = { ip: req.ip, callerId };

    const user = await createUser(req.body, callerRole, meta);

    sendSuccess(res, {
      status: 201,
      message: `Tạo tài khoản ${user.role} thành công`,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}