import { RawCsvRow } from './types/csv';

// Regex: Biểu thức chính quy để kiểm tra một chuỗi có đúng chuẩn email không (có chữ, có @, có dấu chấm...)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interface này mô tả cấu trúc dữ liệu chuẩn bị đưa vào Database 
export interface ValidUserData {
    name: string;
    email: string;
    age: number;
}

export function validateRow(row: RawCsvRow): { isValid: boolean; data?: ValidUserData; reason?: string } {
    // 1. Kiểm tra Name (không được rỗng)
    const name = (row.name || '').trim();
    if (name === '') {
        return { isValid: false, reason: 'Tên (name) không được để trống' };
    }

    // 2. Kiểm tra Email (không rỗng và phải đúng định dạng)
    const email = (row.email || '').trim();
    if (!EMAIL_REGEX.test(email)) {
        return { isValid: false, reason: `Email sai định dạng: ${email}` };
    }

    // 3. Kiểm tra Age (phải là số nguyên và >= 0)
    const ageStr = (row.age || '').trim();
    let age = 0; // Mặc định là 0 nếu file CSV không có cột age hoặc để trống

    if (ageStr !== '') {
        age = parseInt(ageStr, 10);
        if (isNaN(age) || age < 0) {
            return { isValid: false, reason: `Tuổi (age) không hợp lệ: ${ageStr}` };
        }
    }

    // Nếu vượt qua tất cả các bài kiểm tra, trả về dữ liệu chuẩn mực
    return {
        isValid: true,
        data: { name, email, age }
    };
}