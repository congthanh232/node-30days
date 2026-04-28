import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z.string().min(6).max(100)
}).strict(); 

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(100)
}).strict(); 

// Schema để owner tạo admin, hoặc admin tạo member
// Cho phép set role nhưng giới hạn giá trị
export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z.string().min(6).max(100).regex(/[A-Z]/).regex(/[0-9]/),
  role: z.enum(['admin', 'member']),
}).strict();