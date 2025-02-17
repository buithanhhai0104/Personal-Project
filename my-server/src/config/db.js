const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
    setTimeout(() => {
      console.log("🔄 Đang thử kết nối lại...");
      db.getConnection((retryErr, retryConnection) => {
        // Sửa lại từ pool.getConnection thành db.getConnection
        if (retryErr) {
          console.error("🚨 Thử kết nối lại thất bại:", retryErr);
        } else {
          console.log("✅ Kết nối MySQL thành công sau khi thử lại!");
          retryConnection.release();
        }
      });
    }, 5000); // Thử lại sau 5 giây
    return;
  }
  console.log("✅ Kết nối MySQL thành công!");
  connection.release(); // Giải phóng kết nối sau khi kiểm tra
});

module.exports = db;
