import { Router } from 'express';
import { registerController, loginController } from '../../controllers/auth.controller.js';
import { loginLimiter } from '../../middlewares/rateLimiter.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema } from '../../schemas/auth.schema.js';
const router = Router();

router.post('/register',validate(registerSchema,'body'), registerController);
router.post('/login', validate(loginSchema, 'body'), loginLimiter , loginController);

export default router;