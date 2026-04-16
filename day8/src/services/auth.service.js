import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
// fake DB
const users = [];

// secret key (sau này để env)
const JWT_SECRET = 'secret123';

export async function register({ name, email, password }) {
  
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
  };

  users.push(user);

  return user;
}

export async function login({ email, password }) {
  const user = users.find(u => u.email === email);

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  // tạo token
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
}