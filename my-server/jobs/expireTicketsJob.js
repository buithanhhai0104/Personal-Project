const Ticket = require("../src/models/ticketsModel");
const Trip = require("../src/models/tripsModel");
const moment = require("moment");

function startExpireTicketsJob() {
  console.log("🔄 Kiểm tra vé hết hạn...");

  // Lấy danh sách vé chưa thanh toán
  Ticket.getUnpaidTickets((err, tickets) => {
    if (err) {
      console.error("❌ Lỗi khi lấy vé chưa thanh toán:", err);
      return;
    }

    const tripsToUpdate = {};

    // Duyệt qua từng vé để kiểm tra thời gian hết hạn
    tickets.forEach((ticket) => {
      const currentTime = moment();
      const expiresAt = moment(ticket.expires_at);

      if (currentTime.isAfter(expiresAt)) {
        console.log(`⏳ Vé ${ticket.ticket_id} đã hết hạn`);

        if (!tripsToUpdate[ticket.trip_id]) {
          tripsToUpdate[ticket.trip_id] = [];
        }
        tripsToUpdate[ticket.trip_id].push(ticket);
      }
    });

    // Duyệt qua các chuyến đi cần cập nhật ghế
    Object.keys(tripsToUpdate).forEach((tripId) => {
      Trip.getTripById(tripId, (err, results) => {
        if (err) {
          console.error(`❌ Lỗi khi lấy thông tin chuyến đi ${tripId}:`, err);
          return;
        }

        if (!results || results.length === 0) {
          console.error(`⚠️ Không tìm thấy chuyến đi ${tripId}`);
          return;
        }

        let trip = results[0];
        let seats = [];
        console.log(trip.seats, "&&", JSON.parse(trip.seats));
        try {
          seats = trip.seats ? JSON.parse(trip.seats) : [];
          if (!Array.isArray(seats))
            throw new Error("⚠️ Dữ liệu seats không hợp lệ");
        } catch (error) {
          console.error(
            `❌ Lỗi khi parse danh sách ghế của chuyến ${tripId}:`,
            error
          );
          return;
        }

        console.log(
          `📌 Danh sách ghế trước khi cập nhật cho trip ${tripId}:`,
          seats
        );

        tripsToUpdate[tripId].forEach((ticket) => {
          let seatNumbers = ticket.seat_number
            ? ticket.seat_number.split(",").map((s) => s.trim()) // Hỗ trợ nhiều ghế
            : [];

          // Cập nhật trạng thái ghế
          let updatedSeats = seats.map((seat) => {
            if (seatNumbers.includes(seat.seat_number)) {
              return { ...seat, status: "available" }; // Giữ nguyên object, chỉ thay đổi trạng thái
            }
            return seat;
          });

          console.log(
            `🚀 Ghế sau khi cập nhật cho trip ${tripId}:`,
            JSON.stringify(updatedSeats)
          );

          // Cập nhật ghế trước khi cập nhật trạng thái vé
          Trip.updateTripSeats(tripId, JSON.stringify(updatedSeats), (err) => {
            if (err) {
              console.error(
                `❌ Lỗi khi cập nhật ghế cho chuyến đi ${tripId}:`,
                err
              );
              return;
            }

            // Cập nhật trạng thái vé sau khi cập nhật ghế thành công
            Ticket.updateTicketStatus(
              {
                ticket_id: ticket.ticket_id,
                status: "Hủy đặt vé do chưa thanh toán",
              },
              (err) => {
                if (err) {
                  console.error(
                    `❌ Lỗi khi cập nhật trạng thái vé ${ticket.ticket_id}:`,
                    err
                  );
                  return;
                }
                console.log(
                  `✅ Vé ${ticket.ticket_id} đã bị hủy do chưa thanh toán.`
                );
              }
            );
          });
        });
      });
    });
  });
}

module.exports = { startExpireTicketsJob };
