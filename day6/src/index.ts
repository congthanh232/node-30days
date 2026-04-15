import fs from 'fs/promises';
import path from 'path';
import { ok, err, Result } from './result';
import { RawCsvRow, ValidRow, RejectedRow } from './types/csv';



const requiredCols =['name', 'email'];

    //nếu ký tự đầu tiên là BOM thì bỏ đi, không thì giữ nguyên
    function stripBOM(str: string): string {
      return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
    }

    //thay tất cả \r\n và \r thành \n
    function normalizeNewlines(str: string): string {
      return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    function getMaxErrors() {
      const idx = process.argv.indexOf('--max-errors');  
      // không truyền --max-errors → không giới hạn   
      if (idx === -1) return Infinity;
      // Fix — check trước
      const val = process.argv[idx + 1];
      if (val === undefined) return Infinity;
      return parseInt(val, 10);
    }

    // Tạo function riêng để đọc file    
    async function readFile(filePath: string): Promise<Result<string, string>> {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return ok(content);
      } catch {
        return err(`Không tìm thấy file: ${filePath}`);
        }
    }
async function main() {
    //Đọc file csv
    const filePath = path.join(__dirname,'data.csv');
    const result = await readFile(filePath);

    if (!result.ok) {
      console.error(result.error);
      process.exit(1);
    }

    let content = result.value;

    const exportsDir = path.join(__dirname, 'exports');

    //BT4: Làm sạch TRƯỚC khi split
    content = stripBOM(content);
    content = normalizeNewlines(content);

    // Tách dòng, bỏ dòng trống
    const lines   = content.split('\n').filter((line: string) => line.trim() !== '');
    // Fix — check trước
    const firstLine = lines[0];
    if (firstLine === undefined) {
      console.error('File CSV rỗng!');
      process.exit(1);
    }
    const headers = firstLine.split(',').map((h: string) => h.trim());
    // bỏ dòng header, lấy phần còn lại
    const data    = lines.splice(1);

    // 3. Parse từng dòng
    const valid: ValidRow[]         = [];
    const rejected: RejectedRow[] = [];

    //BT5:max-errors
    const maxErrors = getMaxErrors();
    let errorCount  = 0;
    for (const line of data) {
    const values = line.split(',').map((v: string) => v.trim());
    const row: RawCsvRow    = Object.fromEntries(headers.map((h: string, i: number) => [h, values[i] ?? '']));

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

    if (rejected.length === 0) {
      console.log('Không có dòng nào bị reject.');
      return;
    }
    const first = rejected[0];
    if(first === undefined) return;
    const csvHeaders = Object.keys(first);
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