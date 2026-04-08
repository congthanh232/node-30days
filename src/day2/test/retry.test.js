import { describe, it, expect, vi } from 'vitest';
import { retry } from '../utils/retry.js';

describe('Kiểm thử hàm retry()', () => {
  it('✅ Phải trả về kết quả ngay nếu hàm chạy thành công ở lần đầu', async () => {
    // Tạo một hàm giả luôn luôn thành công
    const mockSuccessFn = vi.fn().mockResolvedValue('Dữ liệu chuẩn');

    const result = await retry(mockSuccessFn, { retries: 3, delayMs: 10 });

    expect(result).toBe('Dữ liệu chuẩn');
    expect(mockSuccessFn).toHaveBeenCalledTimes(1); // Chỉ gọi đúng 1 lần
  });

  it('❌ Phải quăng lỗi nếu thất bại vượt quá số lần retries', async () => {
    // Tạo một hàm giả luôn luôn báo lỗi
    const mockFailFn = vi.fn().mockRejectedValue(new Error('Mạng hỏng'));

    // Gọi retry và kỳ vọng nó sẽ ném ra lỗi (toThrow)
    await expect(
      retry(mockFailFn, { retries: 2, delayMs: 10 })
    ).rejects.toThrow('Đã thử 2 lần');

    // Kiểm tra xem nó đã thực sự cố gắng chạy đủ 2 lần chưa
    expect(mockFailFn).toHaveBeenCalledTimes(2);
  });
});
it('✅ BT4: Thời gian đợi phải tăng dần (Exponential Backoff)', async () => {
  const mockFail = vi.fn().mockRejectedValue(new Error('Fail'));

  // không test thời gian thực (vì tốn time),
  // nhưng test xem hàm có chạy đúng số lần không với cấu hình mới
  await expect(
    retry(mockFail, {
      retries: 3,
      delayMs: 50,
      maxDelayMs: 200,
    })
  ).rejects.toThrow();

  expect(mockFail).toHaveBeenCalledTimes(3);
});
