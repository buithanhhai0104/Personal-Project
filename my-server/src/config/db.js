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

  // Sử dụng giao dịch
  connection.beginTransaction((err) => {
    if (err) {
      connection.release();
      console.error("❌ Lỗi bắt đầu giao dịch:", err);
      return;
    }

    // Thực hiện các truy vấn trong giao dịch
    connection.query("YOUR SQL QUERY HERE", (queryErr, results) => {
      if (queryErr) {
        connection.rollback(() => {
          console.error("❌ Lỗi trong giao dịch, rollback:", queryErr);
          connection.release();
        });
        return;
      }

      // Nếu truy vấn thành công, commit giao dịch
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            console.error("❌ Lỗi commit giao dịch, rollback:", commitErr);
            connection.release();
          });
          return;
        }
        console.log("✅ Giao dịch thành công!");
        connection.release();
      });
    });
  });
});

module.exports = db;
