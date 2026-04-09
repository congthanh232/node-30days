import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const requiredCols =['name', 'email'];

    //nếu ký tự đầu tiên là BOM thì bỏ đi, không thì giữ nguyên
    function stripBOM(str) {
      return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
    }

    //thay tất cả \r\n và \r thành \n
    function normalizeNewlines(str) {
      return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    function getMaxErrors() {
      const idx = process.argv.indexOf('--max-errors');  
      // không truyền --max-errors → không giới hạn   
      if (idx === -1) return Infinity;
      return parseInt(process.argv[idx + 1], 10);
    }
async function main() {
    //Đọc file csv
    const filePath = path.join(__dirname,'data.csv');
    let content = await fs.readFile(filePath, 'utf-8');
    const exportsDir = path.join(__dirname, 'exports');

    //BT4: Làm sạch TRƯỚC khi split
    content = stripBOM(content);
    content = normalizeNewlines(content);

    // Tách dòng, bỏ dòng trống
    const lines   = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    // bỏ dòng header, lấy phần còn lại
    const data    = lines.splice(1);

    // 3. Parse từng dòng
    const valid    = [];
    const rejected = [];

    //BT5:max-errors
    const maxErrors = getMaxErrors();
    let errorCount  = 0;
    for (const line of data) {
    const values = line.split(',').map(v => v.trim());
    const row    = Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));

    const missingCols = requiredCols.filter(col => !row[col]);

    if (missingCols.length === 0) {
      valid.push(row);
    } else {
      rejected.push({ ...row, _reason: `Thiếu: ${missingCols.join(', ')}` });
      errorCount++;
      if (errorCount >= maxErrors) {

        console.error(`Dừng: vượt ngưỡng ${maxErrors} lỗi`);
        process.exit(1);
      }
    }
    }
    console.log('Valid:', valid);
    console.log('Rejected:', rejected);


    const csvHeaders = Object.keys(rejected[0]);
    const csvRows    = rejected.map(row => csvHeaders.map(h => row[h]).join(','));
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    //BT3
    // → true nếu có --dry-run, false nếu không có
    const isDryRun = process.argv.includes('--dry-run');

     if (isDryRun) {
      // không ghi file, chỉ in ra màn hình
      console.log('[DRY-RUN] Sẽ ghi rejected.csv với nội dung:');
      console.log(csvContent);
    } else {
    // //tạo thư mục
    await fs.mkdir(exportsDir, { recursive : true });
    await fs.writeFile(
      path.join(exportsDir, 'rejected.csv'),
      csvContent,
      'utf-8'
    );
   }
  // console.log("dry-run",process.argv)
  console.log("max-errors",process.argv)
}
main();