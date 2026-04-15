import path from 'path';
import fs from 'fs/promises';
import { performance } from 'perf_hooks'; 
import pool from './db';                
import { parseCSV } from './parser';
import mysql from 'mysql2/promise';     
import { validateRow, ValidUserData } from './validator'; 

// Hàm tiện ích lấy giá trị từ CLI 
function getArgValue(argName: string): string | undefined {
    const idx = process.argv.indexOf(argName);
    return idx !== -1 ? process.argv[idx + 1] : undefined;
}

async function main() {
    const startTime = performance.now(); //  Bắt đầu đo thời gian thực thi

    // 1. Lấy tham số từ CLI 
    const filePath = getArgValue('--file');
    const isDryRun = process.argv.includes('--dry-run');
    const isCommit = process.argv.includes('--commit');

    if (!filePath) {
        console.error(' Thiếu tham số --file <path>');
        process.exit(1);
    }

    console.log(` Bắt đầu xử lý file: ${filePath}`);

    // 2. Gọi Parser để đọc dữ liệu thô 
    const fullPath = path.resolve(filePath);
    const parseResult = await parseCSV(fullPath);

    if (!parseResult.ok) {
        console.error(` Lỗi: ${parseResult.error}`);
        process.exit(1);
    }

    const rawRows = parseResult.value;
    const accepted: ValidUserData[] = [];
    const rejected: any[] = [];
    let duplicatedCount = 0;

    // 3. Vòng lặp Validation 
    for (const row of rawRows) {
        const result = validateRow(row);
        if (result.isValid && result.data) {
            accepted.push(result.data);
        } else {
            rejected.push({ ...row, _reason: result.reason });
        }
    }

    // 4. Thực thi vào Database 
    if (isCommit && !isDryRun) {
        console.log('--- Đang ghi dữ liệu vào MySQL ---');
        for (const user of accepted) {
            try {
                // Sử dụng câu lệnh INSERT IGNORE 
                const [result] = await pool.execute<mysql.ResultSetHeader>(
                    'INSERT IGNORE INTO users (name, email, age) VALUES (?, ?, ?)',
                    [user.name, user.email, user.age]
                );
                if (result.affectedRows === 0) {
                    duplicatedCount++;
                }
                
            } catch (err) {
                console.error(`Lỗi khi insert email ${user.email}:`, err);
            }
        }
    } else if (isDryRun) {
        console.log('--- [DRY-RUN] Chế độ mô phỏng, không ghi Database ---');
    }

    // Tổng kết và xuất báo cáo 
    const endTime = performance.now();
    const duration = parseFloat(((endTime - startTime) / 1000).toFixed(2));

    const report = {
        summary: {
            total: rawRows.length,
            accepted: accepted.length,
            rejected: rejected.length,
            duplicated: duplicatedCount,
            duration: `${duration}s`
        },
        timestamp: new Date().toISOString()
    };

    // Tạo thư mục exports 
    const exportsDir = path.join(process.cwd(), 'exports');
    await fs.mkdir(exportsDir, { recursive: true });

    // Ghi report.json 
    await fs.writeFile(
        path.join(exportsDir, 'report.json'),
        JSON.stringify(report, null, 2)
    );

    // Ghi rejected.csv nếu có lỗi 
    if (rejected.length > 0) {
        const headers = Object.keys(rejected[0]).join(',');
        const content = [headers, ...rejected.map(r => Object.values(r).join(','))].join('\n');
        await fs.writeFile(path.join(exportsDir, 'rejected.csv'), content);
    }

    console.log(' Hoàn thành!');
    console.table(report.summary);
    
    // Đóng kết nối DB để kết thúc chương trình
    await pool.end();
}

main().catch(console.error);