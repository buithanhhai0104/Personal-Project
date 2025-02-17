const db = require("../config/db");

const Ticket = {
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
    const query = `
      UPDATE tickets 
      SET status = CASE ticket_id
        ${tickets
          .map((ticket) => `WHEN '${ticket.ticket_id}' THEN '${ticket.status}'`)
          .join(" ")}
      END
      WHERE ticket_id IN (${tickets
        .map((ticket) => `'${ticket.ticket_id}'`)
        .join(", ")});
    `;
    db.query(query, callback);
  },

  getUnpaidTickets: (callback) => {
    db.query(
      'SELECT * FROM tickets WHERE status = "Chưa thanh toán"',
      callback
    );
  },

  updateTicketStatus: (ticketId, status, callback) => {
    const query = "UPDATE tickets SET status = ? WHERE ticket_id = ?";
    db.query(query, [status, ticketId], callback);
  },

  getAllTickets: (callback) => {
    const query = `SELECT * FROM tickets`;
    db.query(query, callback);
  },

  deleteTicketById: (ticketId, callback) => {
    const query = `DELETE FROM tickets WHERE ticket_id = ?`;
    db.query(query, [ticketId], callback);
  },
};

module.exports = Ticket;
