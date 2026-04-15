import mysql from 'mysql2/promise';

// Tạo một Connection Pool (Hồ chứa kết nối)
// Pool giúp ứng dụng tái sử dụng kết nối, xử lý nhanh hơn khi import hàng ngàn dòng
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',                  // Tên đăng nhập mặc định của MySQL
  password: '2322003',  
  database: 'day7_db',       // Tên database chúng ta vừa tạo
  waitForConnections: true,
  connectionLimit: 10,           // Cho phép tối đa 10 kết nối đồng thời
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Đã kết nối MySQL (cli_manager) thành công!');
    connection.release(); // Test xong thì trả kết nối về lại cho Pool
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
  });

export default pool;