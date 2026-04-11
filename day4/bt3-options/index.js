import fs from 'fs';
import readline from 'readline';
import path from 'path';

async function splitFile() {
  // Đọc arguments
  const args = process.argv.slice(2);
  const filePath = args[0];
  let chunkSize = 100;
  let outputDir = '.';

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--chunk-size') chunkSize = parseInt(args[i + 1]);
    if (args[i] === '--output-dir') outputDir = args[i + 1];
  }

  // Tạo thư mục nếu chưa có
  fs.mkdirSync(outputDir, { recursive: true });

  // Tìm partIndex an toàn, không ghi đè
  let partIndex = 1;
  while (fs.existsSync(path.join(outputDir, `part_${partIndex}.csv`))) {
    partIndex++;
  }

  // Mở stream đọc file
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers = [];
  let rowCount = 0;
  let currentWriter = null;

  for await (const line of rl) {
    // Lưu header, không ghi vào file
    if (headers.length === 0) {
      headers = line.split(',');
      continue;
    }

    // Mở file mới nếu chưa có hoặc rowCount >= chunkSize
    if (!currentWriter || rowCount >= chunkSize) {
      if (currentWriter) {
        currentWriter.end();
      }

      // Tạo file mới dùng outputDir
      currentWriter = fs.createWriteStream(path.join(outputDir, `part_${partIndex}.csv`));
      currentWriter.write(headers.join(',') + '\n');
      partIndex++;

      rowCount = 0;
    }

    // Ghi dòng vào file hiện tại, rowCount++
    currentWriter.write(line + '\n');
    rowCount++;
  }

  // Đóng file cuối cùng
  if (currentWriter) {
    currentWriter.end();
  }
}

splitFile();