const db = require("../config/db");

const Ticket = {
  // Hàm tạo nhiều vé cùng lúc
  createMultipleTickets: (ticketData, callback) => {
    const query = `
    INSERT INTO tickets (ticket_id, user_id, trip_id, seat_number, email, name, phone, status, expires_at, to_location, from_location)
    VALUES ?;
  `;
    const values = ticketData.map((ticket) => [
      ticket.ticket_id,
      ticket.user_id,
      ticket.trip_id,
      ticket.seat_number,
      ticket.email,
      ticket.name,
      ticket.phone,
      ticket.status,
      ticket.expires_at,
      ticket.to_location,
      ticket.from_location,
    ]);

    console.log("Executing query with values:", values);
    db.query(query, [values], callback);
  },

  getTicketByTicketId: (ticket_id, callback) => {
    const query = `SELECT * FROM tickets WHERE ticket_id = ?`;
    db.query(query, [ticket_id], callback);
  },

  updateMultipleTicketStatus: (tickets, callback) => {
    db.getConnection((err, connection) => {
      if (err) {
        return callback(err);
      }

      const queries = tickets.map(
        (ticket) =>
          `UPDATE tickets SET status = '${ticket.status}' WHERE ticket_id = '${ticket.ticket_id}';`
      );

      connection.beginTransaction(async (err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        try {
          for (let index = 0; index < queries.length; index++) {
            const query = queries[index];
            await new Promise((resolve, reject) => {
              connection.query(query, (err) => {
                if (err) {
                  reject(new Error(`Failed at query #${index + 1}`));
                } else {
                  resolve();
                }
              });
            });
          }

          // Commit giao dịch
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(new Error("Transaction failed."));
              });
            }
            connection.release();
            callback(null);
          });
        } catch (err) {
          return connection.rollback(() => {
            connection.release();
            callback(err);
          });
        }
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
