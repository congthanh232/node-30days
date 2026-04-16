import { z } from 'zod';

// query
export const userQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

// params
export const userParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

// body
export const userBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});