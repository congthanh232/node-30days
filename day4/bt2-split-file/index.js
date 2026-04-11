import fs from 'fs';
import readline from 'readline';

async function splitFile(filePath, n) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers = [];
  let partIndex = 0;
  let rowCount = 0;
  let currentWriter = null;

  for await (const line of rl) {
    // TODO: lưu header, không ghi vào file
    if (headers.length === 0) {
      headers = line.split(',');
      continue;
    }
    // TODO: mở file mới nếu chưa có hoặc rowCount >= n
    if(!currentWriter || rowCount >= n) {
        if(currentWriter) {
            currentWriter.end();
        }
        partIndex++;

        // ghi file mới
        currentWriter = fs.createWriteStream(`part_${partIndex}.csv`);
        currentWriter.write(headers.join(',') + '\n');

        rowCount = 0;
    }
    // TODO: ghi dòng vào file hiện tại, rowCount++
    currentWriter.write(line + '\n');
    rowCount++;
  }

  // TODO: đóng file cuối cùng
  if (currentWriter) {
    currentWriter.end()
  }

}

const filePath = process.argv[2];
const n = parseInt(process.argv[3]);

splitFile(filePath, n);