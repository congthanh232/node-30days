import { pipeline } from 'stream/promises';
import fs from 'fs';

async function main() {
  const filePath = process.argv[2];
  let lineCount = 0;
  let remainder = '';

  try {
    // Kiểm tra file tồn tại không
    if (!filePath) {
      throw new Error('Vui lòng cung cấp đường dẫn file CSV');
    }

    // Dùng pipeline để đọc file
    await pipeline(
      fs.createReadStream(filePath),
      async function* (source) {
        for await (const chunk of source) {
          const lines = (remainder + chunk).split('\n');
          remainder = lines.pop(); // dòng cuối có thể chưa hoàn chỉnh

          for (const line of lines) {
            lineCount++;
            console.log(`Dòng ${lineCount}: ${line}`);
          }
        }

        // Xử lý phần còn lại
        if (remainder) {
          lineCount++;
          console.log(`Dòng ${lineCount}: ${remainder}`);
        }
      }
    );

    console.log(`\nTổng: ${lineCount} dòng`);

  } catch (err) {
    console.error(`Lỗi: ${err.message}`);
    process.exit(1);
  }
}

main();