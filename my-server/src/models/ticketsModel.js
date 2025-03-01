const db = require("../config/db");

const Ticket = {
  // Hàm tạo nhiều vé cùng lúc
  createMultipleTickets: (ticketData, callback) => {
    const query = `
    INSERT INTO tickets (ticket_id, user_id, trip_id, seat_number, email, name, phone, status, expires_at, to_location, from_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

    const seatNumbers = Array.isArray(ticketData.seat_numbers)
      ? ticketData.seat_numbers.join(",")
      : typeof ticketData.seat_numbers === "string"
      ? ticketData.seat_numbers // Nếu đã là chuỗi, giữ nguyên
      : ""; // Nếu null hoặc undefined, gán thành chuỗi rỗng

    const values = [
      ticketData.ticket_id,
      ticketData.user_id,
      ticketData.trip_id,
      seatNumbers,
      ticketData.email,
      ticketData.name,
      ticketData.phone,
      ticketData.status,
      ticketData.expires_at,
      ticketData.to_location,
      ticketData.from_location,
    ];

    console.log("Executing query with values:", values);
    db.query(query, values, callback);
  },

  getTicketByTicketId: (ticket_id, callback) => {
    const query = `SELECT * FROM tickets WHERE ticket_id = ?`;
    db.query(query, [ticket_id], callback);
  },

  updateTicketStatus: (ticket, callback) => {
    if (!ticket || typeof ticket !== "object" || !ticket.ticket_id) {
      console.error("Lỗi: ticket phải là một object hợp lệ", ticket);
      return callback(new Error("Dữ liệu đầu vào không hợp lệ"));
    }

    const query = `UPDATE tickets SET status = ? WHERE ticket_id = ?`;
    db.query(query, [ticket.status, ticket.ticket_id], (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật trạng thái vé:", err);
        return callback(err);
      }
      callback(null, result);
    });
  },

  updateMultipleTicketStatus: async (ticketIds, status) => {
    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      throw new Error("Danh sách ticket_id không hợp lệ");
    }
    const query = `UPDATE tickets SET status = ? WHERE ticket_id IN (?)`;
    await db.promise().query(query, [status, ticketIds]);
  },
  getUnpaidTickets: (callback) => {
    db.query(
      "SELECT * FROM tickets WHERE status = ?",
      ["Chưa thanh toán"],
      callback
    );
  },

  getAllTickets: (callback) => {
    const query = `SELECT * FROM tickets`;
    db.query(query, callback);
  },

  // Hàm xóa vé
  deleteTicketById: (ticketId, callback) => {
    const query = `DELETE FROM tickets WHERE ticket_id = ?`;
    db.query(query, [ticketId], callback);
  },
};

module.exports = Ticket;
