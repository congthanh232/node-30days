import { Router } from 'express';
import { registerController, loginController, createUserController } from '../../controllers/auth.controller.js';
import { loginLimiter } from '../../middlewares/rateLimiter.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema , createUserSchema } from '../../schemas/auth.schema.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
const router = Router();

router.post('/register',validate(registerSchema,'body'), registerController);
router.post('/login', validate(loginSchema, 'body'), loginLimiter , loginController);
router.post('/create-user', authenticate, authorize('owner', 'admin'), validate(createUserSchema,'body'), createUserController);
export default router;