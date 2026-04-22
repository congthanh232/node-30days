import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
import { logActivity } from './activityLog.service.js';
// fake DB
const users = [];
export function resetUsers() {
  users.length = 0;
}
// secret key (sau này để env)
const JWT_SECRET = 'secret123';

export async function register({ name, email, password, role = 'member'}, meta = {}) {
  
  const existing = users.find(u => u.email === email);
  if (existing) {
    throw new AppError({
      code: 'EMAIL_EXISTED',
      message: 'Email đã được sử dụng',
      status: 409,
    });
  }
  
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date()
  };

  users.push(user);

  // Ghi lại hoạt động đăng ký
  await logActivity({
    userId: user.id,
    action: 'REGISTER',
    description: 'User registered',
    ip: meta?.ip, 
  });

  return user;
}

export async function login({ email, password}, meta = {}) {
  const user = users.find(u => u.email === email);

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  // tạo token
  const token = jwt.sign(
    { userId: user.id,
      role: user.role
     },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  // Ghi lại hành động đăng nhập
  await logActivity({
    userId: user.id,
    action: 'LOGIN',
    description: `User ${email} đăng nhập thành công`,
    ip: meta?.ip,
});

  return token;
}

// tìm trong mảng users[]
export function findUserById(id) {
  return users.find(u => u.id === Number(id));
}

// lấy toàn bộ mảng users[]
export function getAllUsers() {
  return users;
}