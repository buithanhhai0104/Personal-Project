const db = require("../config/db");

// Hàm để tạo đơn hàng
const createOrder = (orderData, callback) => {
  const { userId, total, currency, status } = orderData;
  const sql = `
    INSERT INTO orders (user_id, total, currency, status) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [userId, total, currency, status], callback);
};

// Hàm để lấy tất cả đơn hàng
const getOrders = (callback) => {
  const sql = `SELECT * FROM orders`;
  db.query(sql, callback);
};

// Hàm để lấy đơn hàng theo ID
const getOrderById = (orderId, callback) => {
  const sql = `SELECT * FROM orders WHERE id = ?`;
  db.query(sql, [orderId], callback);
};

// Hàm để cập nhật đơn hàng
const updateOrder = (orderId, updatedData, callback) => {
  const { status } = updatedData;
  const sql = `
    UPDATE orders 
    SET status = ?, updated_at = NOW() 
    WHERE id = ?
  `;
  db.query(sql, [status, orderId], callback);
};

// Hàm để xóa đơn hàng
const deleteOrder = (orderId, callback) => {
  const sql = `DELETE FROM orders WHERE id = ?`;
  db.query(sql, [orderId], callback);
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
