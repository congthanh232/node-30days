// src/routes/v1/user.route.js
import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { userQuerySchema, userParamsSchema, userBodySchema } from '../../schemas/user.schema.js';
import { getAllUsers, findUserById } from '../../services/auth.service.js';
import { getActivityLogs } from '../../services/activityLog.service.js'; 
const router = Router();

// GET /users → chỉ admin được xem danh sách tất cả
// request → authenticate → authorize('admin') → handler
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validate(userQuerySchema, 'query'),
  (req, res) => {
    const users = getAllUsers();

    // admin thấy đầy đủ thông tin
    const data = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));

    res.json({ data, query: req.validated });
  }
);

// GET /users/logs → chỉ admin xem được lịch sử hoạt động
router.get(
  '/logs',
  authenticate,
  authorize('admin'),
  (req, res) => {
    const logs = getActivityLogs();
    res.json({ total: logs.length, data: logs });
  }
);

// GET /users/:id → member chỉ xem được của mình, admin xem được tất cả
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'member'),
  validate(userParamsSchema, 'params'),
  (req, res) => {
    const requestedId = req.validated.id;
    const { userId, role } = req.user;

    // member chỉ được xem thông tin của chính mình
    if (role === 'member' && Number(requestedId) !== Number(userId)) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Bạn chỉ được xem thông tin của chính mình',
      });
    }

    const user = findUserById(requestedId);

    if (!user) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Không tìm thấy user',
      });
    }

    // admin thấy đầy đủ, member thấy ít hơn
    if (role === 'admin') {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    }

    // member chỉ thấy thông tin cơ bản
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
);

// POST /users → chỉ admin được tạo user mới
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(userBodySchema, 'body'),
  (req, res) => {
    res.json({ message: 'Tạo user thành công', user: req.validated });
  }
);

export default router;