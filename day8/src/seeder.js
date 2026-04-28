import bcrypt from 'bcrypt';
import { getAllUsers } from './services/auth.service.js';

export async function seedOwners() {
    const users = getAllUsers();

    // kiểm tra owner đã tồn tại chưa
    const ownerExists = users.find(u =>u.role === 'owner');
    if (ownerExists) {
        console.log('[Seeder] Owner đã tồn tại');
        return;
    }

    const hashedPassword = await bcrypt.hash(process.env.OWNER_PASSWORD || 'Owner@123', 10);

    users.push({
        id: users.length + 1,
        name: 'Owner',
        email: process.env.OWNER_EMAIL || 'owner@system.com',
        password: hashedPassword,
        role: 'owner',
        createdAt: new Date(),
    });

    console.log('[Seeder] Owner đã được tạo thành công:', process.env.OWNER_EMAIL || 'owner@system.com'  );
}