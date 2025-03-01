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

  updateMultipleTicketStatus: (ticket, callback) => {
    if (typeof ticket !== "object" || Array.isArray(ticket)) {
      console.error("Lỗi: ticket phải là một object hợp lệ", ticket);
      return callback(new Error("Dữ liệu đầu vào không hợp lệ"));
    }

    db.getConnection((err, connection) => {
      if (err) {
        return callback(err);
      }

      const query = `UPDATE tickets SET status = ? WHERE ticket_id = ?`;

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        connection.query(query, [ticket.status, ticket.ticket_id], (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              callback(new Error(`Lỗi khi cập nhật vé: ${err.message}`));
            });
          }

          // Commit giao dịch
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(new Error("Giao dịch thất bại."));
              });
            }
            connection.release();
            callback(null);
          });
        });
      });
    });
  },

  getUnpaidTickets: (callback) => {
    db.query(
      "SELECT * FROM tickets WHERE status = ?",
      ["Chưa thanh toán"],
      callback
    );
  },

  updateTicketStatus: (ticketId, status, callback) => {
    const query = "UPDATE tickets SET status = ? WHERE ticket_id = ?";
    db.query(query, [status, ticketId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
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
