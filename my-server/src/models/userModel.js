const db = require("../config/db");

const User = {
  // Lấy tất cả người dùng
  getAllUsers: (callback) => {
    const sql = "SELECT * FROM users";
    db.query(sql, callback);
  },

  // Cập nhật thông tin người dùng
  updateUser: (id, data, callback) => {
    const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    db.query(sql, [data.name, data.email, data.role, id], callback);
  },

  // Xóa người dùng
  deleteUser: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Lấy danh sách người dùng theo từ khóa tìm kiếm
  getUsersBySearch: (searchQuery, callback) => {
    const sql = "SELECT * FROM users WHERE name LIKE ?";
    const values = [`%${searchQuery}%`];
    db.query(sql, values, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Lấy người dùng theo ID
  getUserById: (userId, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },
  //Tìm tên tài khoản người dùng theo Name
  findByUsername: (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], callback);
  },

  findByUsernameAndEmail: (username, email, callback) => {
    const sql = "SELECT * FROM users WHERE username = ? AND email = ?";
    db.query(sql, [username, email], callback);
  },
  // thêm tài khoản người dùng
  createAccount: (data, callback) => {
    const sql = `
      INSERT INTO users (name, email, username, password) 
      VALUES (?, ?, ?, ?)`;
    db.query(
      sql,
      [data.name, data.email, data.username, data.password, data.age || null],
      callback
    );
  },
};

module.exports = User;
