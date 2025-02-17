const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/ticketsModel");
const Trip = require("../models/tripsModel");
const moment = require("moment");
const db = require("../config/db");

const ticketsController = {
  bookTicket: (req, res) => {
    try {
      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://personal-project-rlxh.vercel.app"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

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

      Trip.getTripById(trip_id, (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Không thể kiểm tra chuyến đi." });
        if (results.length === 0)
          return res.status(404).json({ message: "Chuyến đi không tồn tại" });

        let seats;
        try {
          seats =
            typeof results[0].seats === "string"
              ? JSON.parse(results[0].seats)
              : results[0].seats;
        } catch (e) {
          return res.status(500).json({ error: "Lỗi phân tích dữ liệu ghế." });
        }

        const unavailableSeats = seat_numbers.filter(
          (seat) =>
            !seats.some(
              (s) => s.seat_number === seat && s.status === "available"
            )
        );
        if (unavailableSeats.length > 0)
          return res.status(400).json({ message: "Ghế đã được đặt." });

        seats = seats.map((seat) =>
          seat_numbers.includes(seat.seat_number)
            ? { ...seat, status: "booked" }
            : seat
        );
        const expires_at = moment()
          .add(10, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");

        const ticketData = seat_numbers.map((seat) => ({
          ticket_id: uuidv4(),
          user_id,
          trip_id,
          seat_number: seat,
          email,
          name,
          phone,
          to_location,
          from_location,
          status: "Chưa thanh toán",
          expires_at,
        }));

        db.beginTransaction((err) => {
          if (err)
            return res.status(500).json({ error: "Lỗi bắt đầu giao dịch." });

          Trip.updateTripSeats(trip_id, seats, (err) => {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ error: "Không thể cập nhật ghế." })
              );

            Ticket.createMultipleTickets(ticketData, (err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ error: "Không thể tạo vé." })
                );

              db.commit((err) => {
                if (err)
                  return db.rollback(() =>
                    res.status(500).json({ error: "Lỗi khi commit giao dịch." })
                  );
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
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi không mong muốn." });
    }
  },

  getTicketByTicketId: (req, res) => {
    Ticket.getTicketByTicketId(req.params.ticket_id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Vé không tồn tại" });
      res.status(200).json(result[0]);
    });
  },

  updateMultipleTicketStatus: async (req, res) => {
    const { changeTicketStatus } = req.body;
    if (!Array.isArray(changeTicketStatus) || !changeTicketStatus.length)
      return res.status(400).json({ error: "Dữ liệu vé không hợp lệ." });

    try {
      await Ticket.updateMultipleTicketStatus(changeTicketStatus);
      res.status(200).json({ message: "Cập nhật trạng thái vé thành công." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllTickets: (req, res) => {
    Ticket.getAllTickets((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  },

  deleteTicketById: (req, res) => {
    Ticket.deleteTicketById(req.params.ticket_id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Vé không tồn tại" });
      res.status(200).json({ message: "Xóa vé thành công" });
    });
  },
};

module.exports = ticketsController;
