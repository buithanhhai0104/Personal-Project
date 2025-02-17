const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/ticketsModel");
const Trip = require("../models/tripsModel");
const moment = require("moment");
const db = require("../config/db");

const ticketsController = {
  bookTicket: (req, res) => {
    const {
      user_id,
      trip_id,
      seat_numbers,
      email,
      name,
      phone,
      to_location,
      from_location,
    } = req.body;
    console.log(req.body);

    // Truy vấn dữ liệu chuyến đi
    Trip.getTripById(trip_id, (err, results) => {
      if (err)
        return res.status(500).json({ error: "Không thể kiểm tra chuyến đi." });
      if (results.length === 0)
        return res.status(404).json({ message: "Chuyến đi không tồn tại" });

      const trip = results[0];
      let seats;
      try {
        seats =
          typeof trip.seats === "string" ? JSON.parse(trip.seats) : trip.seats;
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Không thể phân tích dữ liệu ghế." });
      }

      // Kiểm tra và cập nhật ghế
      const unavailableSeats = seat_numbers.filter((seat) => {
        return !seats.some(
          (s) => s.seat_number === seat && s.status === "available"
        );
      });

      if (unavailableSeats.length > 0) {
        return res.status(400).json({ message: "Ghế đã được đặt" });
      }

      // Cập nhật trạng thái ghế
      seats = seats.map((seat) => {
        if (seat_numbers.includes(seat.seat_number)) {
          seat.status = "booked";
        }
        return seat;
      });

      // Thời gian hết hạn (10 phút)
      const expires_at = moment()
        .add(10, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      console.log("Expires at:", expires_at);

      // Tạo dữ liệu vé
      const ticketData = seat_numbers.map((seat_number) => ({
        ticket_id: uuidv4(),
        user_id,
        trip_id,
        seat_number,
        email,
        name,
        phone,
        to_location,
        from_location,
        status: "Chưa thanh toán",
        expires_at,
      }));

      // Thực hiện giao dịch
      db.beginTransaction((err) => {
        if (err)
          return res.status(500).json({ error: "Lỗi bắt đầu giao dịch." });

        // Cập nhật ghế
        Trip.updateTripSeats(trip_id, seats, (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Không thể cập nhật ghế." });
            });
          }

          // Lưu các vé vào cơ sở dữ liệu
          Ticket.createMultipleTickets(ticketData, (err, ticketResults) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Không thể tạo vé." });
              });
            }

            // Commit giao dịch
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: "Lỗi khi commit giao dịch." });
                });
              }
              res.status(201).json({
                message: "Đặt vé thành công",
                tickets: ticketData,
                updatedSeats: seats,
              });
            });
          });
        });
      });
    });
  },

  getTicketByTicketId: (req, res) => {
    const { ticket_id } = req.params;
    Ticket.getTicketByTicketId(ticket_id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Vé không tồn tại" });
      }
      res.status(200).json(result[0]);
    });
  },

  updateMultipleTicketStatus: (req, res) => {
    const { changeTicketStatus } = req.body;

    if (!Array.isArray(changeTicketStatus) || changeTicketStatus.length === 0) {
      return res.status(400).json({ error: "Dữ liệu vé không hợp lệ." });
    }

    const query = `
      UPDATE tickets 
      SET status = CASE ticket_id
        ${changeTicketStatus
          .map((ticket) => `WHEN '${ticket.ticket_id}' THEN '${ticket.status}'`)
          .join(" ")}
      END
      WHERE ticket_id IN (${changeTicketStatus
        .map((ticket) => `'${ticket.ticket_id}'`)
        .join(", ")});
    `;

    db.query(query, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Không thể cập nhật trạng thái vé." });
      }
      res.status(200).json({ message: "Cập nhật trạng thái vé thành công." });
    });
  },

  getAllTickets: (req, res) => {
    Ticket.getAllTickets((err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  },

  deleteTicketById: (req, res) => {
    const { ticket_id } = req.params;
    Ticket.deleteTicketById(ticket_id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vé không tồn tại" });
      }
      res.status(200).json({ message: "Xóa vé thành công" });
    });
  },
};

module.exports = ticketsController;
