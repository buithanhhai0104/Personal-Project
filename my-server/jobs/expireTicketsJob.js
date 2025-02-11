const cron = require("node-cron");
const Ticket = require("../src/models/ticketsModel");
const Trip = require("../src/models/tripsModel");
const moment = require("moment");

// Hàm khởi động cron job
function startExpireTicketsJob() {
  cron.schedule("* * * * *", () => {
    console.log("Kiểm tra vé hết hạn...");

    // Lấy các vé chưa thanh toán
    Ticket.getUnpaidTickets((err, tickets) => {
      if (err) {
        console.error("Lỗi khi lấy vé chưa thanh toán:", err);
        return;
      }

      // Nhóm vé theo trip_id để xử lý một lần
      const tripsToUpdate = {};

      tickets.forEach((ticket) => {
        const currentTime = moment();
        const expiresAt = moment(ticket.expires_at);

        if (currentTime.isAfter(expiresAt)) {
          console.log(`Vé ${ticket.ticket_id} hết hạn`);

          // Nhóm vé theo trip_id để xử lý tất cả ghế cùng một chuyến
          if (!tripsToUpdate[ticket.trip_id]) {
            tripsToUpdate[ticket.trip_id] = [];
          }

          tripsToUpdate[ticket.trip_id].push(ticket);
        }
      });

      // Xử lý từng chuyến xe
      Object.keys(tripsToUpdate).forEach((tripId) => {
        Trip.getTripById(tripId, (err, results) => {
          if (err) {
            console.error(`Lỗi khi lấy thông tin chuyến đi: ${tripId}`, err);
            return;
          }

          if (!results || results.length === 0) {
            console.error(`Không tìm thấy chuyến đi: ${tripId}`);
            return;
          }

          const trip = results[0];
          const seats = Array.isArray(trip.seats)
            ? trip.seats
            : JSON.parse(trip.seats || "[]");

          // Cập nhật ghế cho tất cả vé của chuyến
          tripsToUpdate[tripId].forEach((ticket) => {
            const updatedSeats = seats.map((seat) => {
              if (seat.seat_number === ticket.seat_number) {
                seat.status = "available"; // Cập nhật trạng thái ghế
              }
              return seat;
            });

            // Cập nhật ghế trong chuyến xe
            Trip.updateTripSeats(tripId, updatedSeats, (err) => {
              if (err) {
                console.error(
                  `Lỗi khi cập nhật ghế cho chuyến đi ${tripId}:`,
                  err
                );
                return;
              }

              // Cập nhật vé thành hết hạn
              Ticket.updateTicketStatus(
                ticket.ticket_id,
                "Hủy đặt vé do chưa thanh toán",
                (err) => {
                  if (err) {
                    console.error(
                      `Lỗi khi cập nhật trạng thái vé ${ticket.ticket_id}:`,
                      err
                    );
                    return;
                  }

                  console.log(
                    `Ghế ${ticket.seat_number} trên chuyến đi ${tripId} đã được cập nhật thành "available"`
                  );
                }
              );
            });
          });
        });
      });
    });
  });

  console.log("Cron job kiểm tra vé hết hạn đã được khởi động.");
}

module.exports = startExpireTicketsJob;
