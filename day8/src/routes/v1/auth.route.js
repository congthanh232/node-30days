import { Router } from 'express';
import { registerController, loginController } from '../../controllers/auth.controller.js';
import { loginLimiter } from '../../middlewares/rateLimiter.js';
const router = Router();

router.post('/register', registerController);
router.post('/login', loginLimiter , loginController);

export default router;