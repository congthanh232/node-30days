import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bus from './bus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_PATH = path.join(LOG_DIR, 'import.jsonl');

fs.mkdirSync(LOG_DIR, { recursive: true });

// Định nghĩa hàm
function writeLog(eventName, data) {
  const entry = {
    event: eventName,
    timestamp: new Date().toISOString(),
    data: data
  };
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
}

// Sau đó mới gọi (hoặc để listener gọi)
bus.once('import.started', (data) => writeLog('import.started', data));
bus.on('import.rowAccepted', (data) => writeLog('import.rowAccepted', data));
bus.on('import.rowRejected', (data) => writeLog('import.rowRejected', data));
bus.once('import.finished', (data) => writeLog('import.finished', data));