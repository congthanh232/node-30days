// 1. Sử dụng module native của Node.js để tạo khoảng đợi mà không cần viết hàm sleep thủ công
import { setTimeout } from 'node:timers/promises';

/**
 * Hàm retry
 * @param {Function} fn - Một hàm async cần thực thi
 * @param {Object} options - Cấu hình
 * @param {number} options.retries - Số lần thử lại tối đa
 * @param {number} options.delayMs - Thời gian chờ giữa mỗi lần thử (ms)
 */
export async function retry(
  fn,
  { retries = 3, delayMs = 1000, maxDelayMs = 10000 } = {}
) {
  let lastError;

  // Dùng vòng lặp for để kiểm soát số lần thử
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Thử thực thi hàm truyền vào
      // Nếu thành công (resolve), return kết quả ngay lập tức để thoát hàm
      return await fn();
    } catch (error) {
      // Nếu thất bại (reject), lưu lại lỗi mới nhất
      lastError = error;

      console.log(`[Lần ${attempt}] Thử lại thất bại: ${error.message}`);

      // Nếu đây là lần thử cuối cùng rồi mà vẫn lỗi -> Không đợi nữa, thoát vòng lặp
      if (attempt === retries) break;

      // --- LOGIC BT4: EXPONENTIAL BACKOFF + JITTER ---

      // 1. Công thức lũy tiến: delay * 2^(lần_thử - 1)
      // Lần 1: 1000 * 1 = 1000ms
      // Lần 2: 1000 * 2 = 2000ms
      // Lần 3: 1000 * 4 = 4000ms
      const backoffDelay = delayMs * Math.pow(2, attempt - 1);

      // 2. Max Delay: Không được vượt quá ngưỡng cấu hình (ví dụ 10s)
      const cappedDelay = Math.min(backoffDelay, maxDelayMs);

      // 3. Jitter: Cộng thêm một số ngẫu nhiên từ 0 đến 200ms
      // Điều này giúp rải đều các yêu cầu nếu có hàng ngàn máy cùng retry
      const jitter = Math.floor(Math.random() * 200);

      const finalDelay = cappedDelay + jitter;

      console.log(`⏳ [BT4] Đợi ${finalDelay}ms trước khi thử lại...`);
      await setTimeout(finalDelay);
    }
  }

  // Nếu chạy hết vòng lặp mà không return được kết quả ở khối try
  // Nghĩa là tất cả các lần thử đều thất bại -> Ném lỗi cuối cùng ra ngoài
  throw new Error(
    `Đã thử ${retries} lần nhưng vẫn thất bại. Lỗi cuối cùng: ${lastError.message}`
  );
}
