// Đọc xem môi trường là gì (nếu chưa có thì mặc định lấy 'development').
const env = process.env.NODE_ENV || 'development';
const REQUIRED_ENVS = ['PORT'];

function validateEnv() {
  const missingEnvs = REQUIRED_ENVS.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    console.error('-----------------------------------------');
    console.error('❌ LỖI: Thiếu biến môi trường bắt buộc:');
    missingEnvs.forEach((env) => console.error(`   - ${env}`));
    console.error('-----------------------------------------');

    // Yêu cầu của BT4: Thoát với exit code != 0
    process.exit(1);
  }

  console.log(`✅ Kiểm tra môi trường: Hoàn tất (Đã đọc file .env.${env}).`);
  console.log('CHECK ENV PORT:', process.env.PORT);
}

validateEnv();
