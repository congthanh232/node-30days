import { describe, it, expect } from 'vitest';
import { processWithLimit } from '../utils/concurrency.js';

describe('Kiểm thử hàm processWithLimit()', () => {
  it(' Phải xử lý đủ tất cả các phần tử trong mảng', async () => {
    const items = [1, 2, 3, 4, 5];

    // Hàm nhân đôi giá trị
    const asyncTask = async (num) => {
      return num * 2;
    };

    const results = await processWithLimit(items, 2, asyncTask);

    console.log(" MẢNG KẾT QUẢ TỪ CONCURRENCY LÀ:\n", results);

    // Kỳ vọng kết quả phải có đủ 5 phần tử
    expect(results.length).toBe(5);

    // Kiểm tra xem kết quả đầu tiên và cuối cùng có đúng logic không
    expect(results[0].data).toBe(2); // 1 * 2 = 2
    expect(results[4].data).toBe(10); // 5 * 2 = 10

    // Kiểm tra trạng thái
    expect(results[0].status).toBe(' OK');
  });
});
