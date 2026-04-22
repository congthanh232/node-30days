import logger from './logger.js';

// ─── HÀM GỬI MESSAGE THÔ LÊN TELEGRAM ───────────────────────────────────────
// Hàm này chỉ làm 1 việc đơn giản: gọi API Telegram để gửi text
// Được dùng bởi notifyError bên dưới
export async function sendTelegram(text) {
  // Telegram Bot API endpoint để gửi message
  // TOKEN xác định đây là bot nào
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID, // gửi tới chat/group nào
        text,                                   // nội dung tin nhắn
        parse_mode: 'HTML',                     // cho phép dùng <b>, <pre>... trong message
      }),
    });

    // Telegram trả về ok: false nếu gửi thất bại (sai token, sai chat_id...)
    if (!res.ok) {
      const body = await res.text();
      logger.error(`[Telegram] Gửi thất bại: ${body}`);
    }
  } catch (err) {
    // QUAN TRỌNG: không throw ra ngoài
    // Vì đây chỉ là thông báo phụ — nếu Telegram lỗi
    // không được để crash cả app
    logger.error('[Telegram] Lỗi kết nối:', err.message);
  }
}

// ─── HÀM FORMAT VÀ GỬI THÔNG BÁO LỖI ────────────────────────────────────────
// Hàm này nhận vào err (lỗi) và req (request đang xử lý)
// → format thành message đẹp → gọi sendTelegram để gửi đi
// Được gọi trong errorHandler.js khi có lỗi 500
export async function notifyError(err, req) {
  // Lấy thời gian hiện tại theo giờ Việt Nam
  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Nếu request đã được authenticate thì lấy thông tin user
  // req.user được gắn vào bởi middleware authenticate
  const user = req.user
    ? `ID=${req.user.id} | Role=${req.user.role}`
    : 'Chưa đăng nhập';

  // Format message — dùng HTML vì đã set parse_mode: 'HTML'
  // <b> = in đậm, <pre> = code block (monospace, giữ xuống dòng)
  const message = `
🚨 <b>SERVER ERROR</b>

⏰ <b>Time:</b> ${now}
🌐 <b>Method:</b> ${req.method}
📍 <b>Path:</b> ${req.originalUrl}
👤 <b>User:</b> ${user}
🔑 <b>IP:</b> ${req.ip}

❌ <b>Error:</b> ${err.message}
🔥 <b>Stack:</b>
<pre>${err.stack?.slice(0, 800)}</pre>
  `.trim();
  // slice(0, 800) → cắt bớt stack trace nếu quá dài
  // vì Telegram giới hạn message tối đa 4096 ký tự

  await sendTelegram(message);
}