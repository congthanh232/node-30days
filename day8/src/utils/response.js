/**
 * Chuẩn hóa success response
 * @param {object} res     - Express response object
 * @param {object} opts
 * @param {number} opts.status   - HTTP status code (default: 200)
 * @param {string} opts.message  - Thông báo
 * @param {any}    opts.data     - Data trả về
 */
export function sendSuccess(res, { status = 200, message = 'Thành công', data = null } = {}) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

/**
 * Chuẩn hóa error response
 * @param {object} res     - Express response object
 * @param {object} opts
 * @param {number} opts.status   - HTTP status code
 * @param {string} opts.code     - Error code
 * @param {string} opts.message  - Thông báo lỗi
 * @param {array}  opts.details  - Chi tiết lỗi (validation...)
 * @param {string} opts.traceId  - ID theo dõi lỗi
 */
export function sendError(res, { status = 400, code = 'ERROR', message = 'Có lỗi xảy ra', details = [], traceId } = {}) {
  return res.status(status).json({
    success: false,
    code,
    message,
    details,
    ...(traceId ? { traceId } : {}),
  });
}