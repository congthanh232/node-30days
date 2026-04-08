/**
 * Hàm giới hạn xử lý đồng thời (Worker Pool Pattern)
 * @param {Array} items - Danh sách các phần tử cần xử lý (VD: mảng 10 URL)
 * @param {number} limit - Số lượng tối đa chạy cùng lúc (VD: 3)
 * @param {Function} asyncFn - Hàm xử lý công việc (VD: hàm fetch URL)
 */
//BT2
export async function processWithLimit(items, limit, asyncFn) {
  let currentIndex = 0;
  const results = [];

  // Tạo số worker = limit
  const workers = Array.from({ length: limit }, () => worker());
  // Định nghĩa công việc của 1 worker
  async function worker() {
    // Chừng nào vẫn còn việc trong hàng đợi thì còn làm
    while (currentIndex < items.length) {
      // Nhận 1 việc và lập tức tăng chỉ mục lên để không worker nào bị trùng
      const index = currentIndex++;

      try {
        const data = await asyncFn(items[index]);
        // Lưu kết quả thành công vào đúng vị trí của nó
        results[index] = { url: items[index], status: ' OK', data };
      } catch (error) {
        // Nếu lỗi (vd: rớt mạng), cũng ghi nhận lại chứ không làm sập cả dây chuyền
        results[index] = {
          url: items[index],
          status: ' FAIL',
          data: error.message,
        };
      }
    }
  }

  // Chờ tất cả công nhân tan ca thì báo cáo kết quả
  await Promise.all(workers);

  return results;
}
