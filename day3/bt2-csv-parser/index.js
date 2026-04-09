import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const requiredCols =['name', 'email'];

async function main() {
    //Đọc file csv
    const filePath = path.join(__dirname,'data.csv');
    const content = await fs.readFile(filePath, 'utf-8');
    const exportsDir = path.join(__dirname, 'exports');

    // Tách dòng, bỏ dòng trống
    const lines   = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    // bỏ dòng header, lấy phần còn lại
    const data    = lines.splice(1);

    // 3. Parse từng dòng
    const valid    = [];
    const rejected = [];
    for (const line of data) {
    const values = line.split(',').map(v => v.trim());
    const row    = Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));

    const missingCols = requiredCols.filter(col => !row[col]);

    if (missingCols.length === 0) {
      valid.push(row);
    } else {
      rejected.push({ ...row, _reason: `Thiếu: ${missingCols.join(', ')}` });
    }
    }
    console.log('Valid:', valid);
    console.log('Rejected:', rejected);


    const csvHeaders = Object.keys(rejected[0]);
    const csvRows    = rejected.map(row => csvHeaders.map(h => row[h]).join(','));
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // tạo thư mục
    await fs.mkdir(exportsDir, { recursive : true });
    await fs.writeFile(
      path.join(exportsDir, 'rejected.csv'),
      csvContent,
      'utf-8'
    );
}
main();