import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
import { logActivity } from './activityLog.service.js';
// ─── FAKE DB ─────────────────────────────────────────────────────────────────
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export function resetUsers() {
  users.length = 0;
}

// ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────

// Dùng chung cho register và createUser
function assertEmailNotExisted(email) {
  const existing = users.find(u => u.email === email);
  if (existing) {
    throw new AppError({
      code: 'EMAIL_EXISTED',
      message: 'Email đã được sử dụng',
      status: 409,
    });
  }
}

async function buildAndSaveUser({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}

// ─── PUBLIC FUNCTIONS ─────────────────────────────────────────────────────────

export async function register({ name, email, password, role = 'member'}, meta = {}) {
  // Chặn không cho tạo owner qua API — owner chỉ tạo qua seeder
  if (role === 'owner') {
    throw new AppError({
      code: 'FORBIDDEN',
      message: 'Không thể tạo tài khoản owner qua API',
      status: 403,
    });
  }

  assertEmailNotExisted(email);
  const user = await buildAndSaveUser({ name, email, password, role });

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

export async function createUser({ name, email, password, role }, callerRole, meta = {}) {
  
  // owner tạo được admin và member
  // admin chỉ tạo được member
  const allowedByRole = {
    owner: ['admin', 'member'],
    admin: ['member'],
  };

  const allowed = allowedByRole[callerRole] || [];
  if (!allowed.includes(role)) {
    throw new AppError({
      code: 'FORBIDDEN',
      message: `Bạn không có quyền tạo tài khoản ${role}`,
      status: 403,
    });
  }

  assertEmailNotExisted(email);
  const user = await buildAndSaveUser({ name, email, password, role });

  await logActivity({
    userId: meta?.callerId,
    action: 'CREATE_USER',
    description: `Tạo tài khoản ${role}: ${email}`,
    ip: meta?.ip,
  });

  return user;
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────
// tìm trong mảng users[]
export function findUserById(id) {
  return users.find(u => u.id === Number(id));
}

// lấy toàn bộ mảng users[]
export function getAllUsers() {
  return users;
}