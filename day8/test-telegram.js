import 'dotenv/config';
import { sendTelegram } from './src/config/telegram.js';

await sendTelegram('🎉 Hello từ Node.js! Test thành công!');
console.log('Gửi xong!');