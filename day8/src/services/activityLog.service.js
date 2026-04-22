// Fake DB — sau này thay bằng query database thật
const activityLogs = [];

/**
 * Ghi lại 1 hành động của user
 * @param {number|null} userId  - ID user thực hiện (null nếu chưa đăng nhập)
 * @param {string}      action  - Tên hành động: 'LOGIN', 'REGISTER'...
 * @param {string}      description - Mô tả chi tiết
 * @param {string}      ip      - IP của client
 */
export async function logActivity({ userId, action, description, ip }) {
  const entry = {
    id: activityLogs.length + 1,
    userId,
    action,
    description,
    ip,
    createdAt: new Date(),
  };

  activityLogs.push(entry);
  return entry;
}

/**
 * Lấy danh sách logs — chỉ admin dùng
 */
export function getActivityLogs() {
  // Mới nhất lên đầu
  return [...activityLogs].reverse();
}