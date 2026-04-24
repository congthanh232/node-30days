import { z } from 'zod';

// query
export const userQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
}).strict();

// params
export const userParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
}).strict();

// body
export const userBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
}).strict();