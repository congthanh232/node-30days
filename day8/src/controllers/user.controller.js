import { getAllUsers, findUserById } from '../services/auth.service.js';
import { getActivityLogs } from '../services/activityLog.service.js';
import { sendSuccess } from '../utils/response.js';
import AppError from '../errors/AppError.js';

// ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────

// owner và admin thấy đầy đủ, member thấy ít hơn
function formatUser(user, role) {
  const base = { id: user.id, name: user.name, email: user.email };
  if (role === 'owner' || role === 'admin') {
    return { ...base, role: user.role, createdAt: user.createdAt };
  }
  return base;
}

// ─── PUBLIC CONTROLLERS ───────────────────────────────────────────────────────

export async function listUsersController(req, res, next) {
  try {
    const { role } = req.user;
    const users = getAllUsers();
    const data = users.map(u => formatUser(u, role));
    sendSuccess(res, { message: 'Lấy danh sách user thành công', data });
  }
  catch (err) {
    next(err);
  }
}

export async function getUserController(req, res, next) {
  try {
    const requestedId = req.validated.id;
    const { userId, role } = req.user;
    // member chỉ được xem thông tin của chính mình
    if (role === 'member' && Number(requestedId) !== Number(userId)) {
      return next(new AppError({
        code: 'FORBIDDEN',
        message: 'Bạn chỉ được xem thông tin của chính mình',
        status: 403
      }));
    }

    const user = findUserById(requestedId);
    if (!user) {
      return next(new AppError({
        code: 'NOT_FOUND',
        message: 'Không tìm thấy user',
        status: 404
      }));
    }

    sendSuccess(res, { message: 'Lấy thông tin user thành công', data: formatUser(user, role) });
  } catch (err) {
    next(err);
  }
}

export async function createUserController(req, res, next) {
  try {
      sendSuccess(res, { message: 'Tạo user thành công', data: req.validated });
  } catch (err) {
      next(err);
  }
}

export async function getActivityLogsController(req, res, next) {
  try {
    const logs = getActivityLogs();
    sendSuccess(res, { message: `Có ${logs.length} hoạt động`, data: logs });

  } catch (err) {
    next(err);
  }
}