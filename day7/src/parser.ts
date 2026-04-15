import fs from 'fs/promises';
import { ok, err, Result } from './result';
import { RawCsvRow } from './types/csv';

// 1. Các hàm tiện ích làm sạch chuỗi 
function stripBOM(str: string): string {
    return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
}

function normalizeNewlines(str: string): string {
    return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

// 2. Hàm chính để đọc và parse CSV
export async function parseCSV(filePath: string): Promise<Result<RawCsvRow[], string>> {
    try {
        // Đọc file
        let content = await fs.readFile(filePath, 'utf-8');

        // Làm sạch chuỗi trước khi split
        content = stripBOM(content);
        content = normalizeNewlines(content);

        // Tách dòng, bỏ dòng rỗng
        const lines = content.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            return err('File CSV rỗng hoặc không có dữ liệu!');
        }

        // Lấy Header
        const firstLine = lines[0];
        if (firstLine === undefined) {
            return err('Lỗi không xác định khi đọc header!');
        }
        
        const headers = firstLine.split(',').map(h => h.trim());
        
        // Bỏ dòng header, lấy mảng dữ liệu
        const dataLines = lines.slice(1);

        // Parse từng dòng text thành object RawCsvRow
        const rawRows: RawCsvRow[] = dataLines.map(line => {
            const values = line.split(',').map(v => v.trim());
            // Map header với value tương ứng
            return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])) as RawCsvRow;
        });

        return ok(rawRows);

    } catch (error: any) {
        return err(`Không thể đọc file tại ${filePath}. Chi tiết: ${error.message}`);
    }
}