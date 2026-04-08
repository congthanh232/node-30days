import { processWithLimit } from '../utils/concurrency.js';
//BT2
// Danh sách 10 URL (Cố tình cho 1 cái URL sai bét để test việc bắt lỗi)
const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/todos/2',
  'https://jsonplaceholder.typicode.com/todos/3',
  'https://jsonplaceholder.typicode.com/todos/4',
  'https://jsonplaceholder.typicode.com/todos/5',
  'https://api.github.com/users/github',
  'https://mot-cai-domain-khong-ton-tai.com.vn', // <--  Fail
  'https://jsonplaceholder.typicode.com/todos/6',
  'https://jsonplaceholder.typicode.com/todos/7',
  'https://jsonplaceholder.typicode.com/todos/8',
];

/**
 * Hàm đo thời gian ping một URL cụ thể
 */
async function pingUrl(url) {
  const startTime = performance.now(); // Bấm đồng hồ tính giờ

  // Dùng fetch native của Node.js
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  // Chỉ lấy header để test cho nhẹ
  await response.text();

  const endTime = performance.now(); // Bấm dừng đồng hồ
  const latency = Math.round(endTime - startTime); // Tính độ trễ (ms)

  return `${latency} ms`;
}

// === HÀM CHẠY CHÍNH ===
async function runTool() {
  console.log(
    `🚀 Bắt đầu ping ${urls.length} URLs với Concurrency Limit = 3...\n`
  );

  // Gọi hàm chúng ta vừa viết ở file kia
  const results = await processWithLimit(urls, 3, pingUrl);

  // In kết quả ra một cái bảng cực kỳ sang trọng (tính năng có sẵn của Node)
  console.table(results, ['url', 'status', 'data']);

  // Tổng kết như yêu cầu của Bài tập
  const successCount = results.filter((r) => r.status === ' OK').length;
  console.log(
    `\n TỔNG KẾT: Thành công: ${successCount} | Thất bại: ${urls.length - successCount}`
  );
}

runTool();
