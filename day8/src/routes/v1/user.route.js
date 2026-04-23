// src/routes/v1/user.route.js
import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { userQuerySchema, userParamsSchema, userBodySchema } from '../../schemas/user.schema.js';
import { listUsersController, getUserController, createUserController, getActivityLogsController } from '../../controllers/user.controller.js';
const router = Router();

// GET /users → chỉ admin được xem danh sách tất cả
// request → authenticate → authorize('admin') → handler
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validate(userQuerySchema, 'query'),
  listUsersController
);

// GET /users/logs → chỉ admin xem được lịch sử hoạt động
router.get(
  '/logs',
  authenticate,
  authorize('admin'),
  getActivityLogsController
);

// GET /users/:id → member chỉ xem được của mình, admin xem được tất cả
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'member'),
  validate(userParamsSchema, 'params'),
  getUserController
);

// POST /users → chỉ admin được tạo user mới
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(userBodySchema, 'body'),
  createUserController
);

export default router;