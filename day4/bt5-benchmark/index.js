import { pipeline } from 'stream/promises';
import fs from 'fs';

async function benchmark(filePath) {
  // Chụp lại mức RAM đang dùng TRƯỚC khi xử lý
  const memBefore = process.memoryUsage();

  // Ghi lại thời điểm bắt đầu (milliseconds)
  const start = Date.now();

  let lineCount = 0;
  let remainder = ''; // Lưu phần dở dang nếu chunk bị cắt giữa dòng

  await pipeline(
    // Đọc file theo từng chunk nhỏ, không load cả file vào RAM
    fs.createReadStream(filePath),

    async function* (source) {
      for await (const chunk of source) {
        // Ghép phần dở dang của chunk trước + chunk hiện tại
        // rồi tách ra thành từng dòng
        const lines = (remainder + chunk).split('\n');

        // Dòng cuối có thể chưa hoàn chỉnh (chunk bị cắt)
        // → lưu lại để ghép với chunk tiếp theo
        remainder = lines.pop();

        // Đếm số dòng hoàn chỉnh
        lineCount += lines.length;
      }

      // Xử lý dòng cuối cùng còn sót lại
      if (remainder) lineCount++;
    }
  );

  // Chụp lại mức RAM đang dùng SAU khi xử lý xong
  const memAfter = process.memoryUsage();

  // Tính tổng thời gian chạy
  const durationMs = Date.now() - start;

  const report = {
    file: filePath,

    // Lấy size file từ disk, đổi bytes → MB
    fileSizeMB: +((fs.statSync(filePath).size / 1024 / 1024).toFixed(2)),

    lineCount,
    durationMs,

    // rss = tổng RAM process dùng (bao gồm cả Node.js runtime)
    // heapUsed = RAM JavaScript đang thực sự dùng
    // Đổi bytes → MB bằng cách chia 1024 * 1024
    memoryBefore: {
      rssMB: +(memBefore.rss / 1024 / 1024).toFixed(2),
      heapUsedMB: +(memBefore.heapUsed / 1024 / 1024).toFixed(2),
    },
    memoryAfter: {
      rssMB: +(memAfter.rss / 1024 / 1024).toFixed(2),
      heapUsedMB: +(memAfter.heapUsed / 1024 / 1024).toFixed(2),
    },
  };

  // Ghi report ra file JSON với format đẹp (indent 2 spaces)
  fs.writeFileSync('report.json', JSON.stringify(report, null, 2));
  console.log(`Done! ${lineCount} dòng trong ${durationMs}ms`);
}

benchmark(process.argv[2]);