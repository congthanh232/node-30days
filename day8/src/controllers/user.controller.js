import { getAllUsers, findUserById } from '../services/auth.service.js';
import { getActivityLogs } from '../services/activityLog.service.js';
import { sendSuccess, sendError } from '../utils/response.js'; 
export async function listUsersController(req, res, next) {
  try {
    const users = getAllUsers();

    // admin thấy đầy đủ thông tin
    const data = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
    sendSuccess(res, { data });
  }
  catch (err) {
    next(err);
  }
};

export async function getUserController(req, res, next) {
    try {
        const requestedId = req.validated.id;
        const { userId, role } = req.user;

        // member chỉ được xem thông tin của chính mình
        if (role === 'member' && Number(requestedId) !== Number(userId)) {
          return sendError(res, {
            code: 'FORBIDDEN',
            message: 'Bạn chỉ được xem thông tin của chính mình',
            status: 403
          });
        }

        const user = findUserById(requestedId);

        if (!user) {
          return sendError(res, {
            code: 'NOT_FOUND',
            message: 'Không tìm thấy user',
            status: 404
          });
        }

        // admin thấy đầy đủ, member thấy ít hơn
        if (role === 'admin') {
          return sendSuccess(res, {
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt
            }
          });
        }

        sendSuccess(res, {
          data: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      } catch (err) {
        next(err);
      }

};

export async function createUserController(req, res, next) {
    try {
        sendSuccess(res, {
          message: 'Tạo user thành công',
          data: req.validated
        });
    } catch (err) {
        next(err);
    }
};

export async function getActivityLogsController(req, res, next) {
  try {
    const logs = getActivityLogs();
    sendSuccess(res, {
        message: `Có ${logs.length} hoạt động`,
        data: logs
    });

  } catch (err) {
    next(err);
  }
};