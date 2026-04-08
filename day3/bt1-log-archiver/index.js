import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
async function main() {
  const logsDir = path.join(__dirname, 'logs');
  const files = await fs.readdir(logsDir);
  const exportsDir = path.join(__dirname, 'exports');
  const summary = {};

for (const file of files) {
    // đọc danh sách trong file
  const content = await fs.readFile(path.join(logsDir, file), 'utf-8');
  const lines   = content.split('\n').filter(line => line.trim() !== '');
  const date    = file.replace('app-', '').replace('.log', '');

  summary[date] = (summary[date] ?? 0) + lines.length;
}
console.log(summary);

// tạo thư mục
await fs.mkdir(exportsDir, { recursive : true });
await fs.writeFile(
  path.join(exportsDir, 'logs-summary.json'),
  JSON.stringify(summary),
  'utf-8'
);

}


main();
