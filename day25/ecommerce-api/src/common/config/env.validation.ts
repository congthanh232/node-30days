import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),

  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  TELEGRAM_BOT_TOKEN: Joi.string().optional(),
  TELEGRAM_CHAT_ID: Joi.string().optional(),

  CORS_ORIGIN: Joi.string().optional().default('http://localhost:5173'),
});
