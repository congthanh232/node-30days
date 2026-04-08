// check server
export function runHealthcheck() {
  // Lấy thông tin RAM (mặc định Node trả về đơn vị Byte, mình chia cho 1024x1024 để ra Megabyte)
  const memoryUsage = process.memoryUsage();
  const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);

  // Lấy múi giờ hiện tại của máy chủ
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log('=== SYSTEM HEALTHCHECK ===');
  console.log(`Node Version: ${process.version}`);
  console.log(`Platform    : ${process.platform}`);
  console.log(`CWD         : ${process.cwd()}`);
  console.log(`Memory Usage: ${memoryMB} MB`);
  console.log(`Timezone    : ${timezone}`);
  console.log('==========================\n');
}

runHealthcheck();
