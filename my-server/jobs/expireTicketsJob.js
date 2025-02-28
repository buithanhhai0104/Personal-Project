const Ticket = require("../src/models/ticketsModel");
const Trip = require("../src/models/tripsModel");
const moment = require("moment");
const db = require("../src/config/db");

function startExpireTicketsJob() {
  console.log("🔄 Kiểm tra vé hết hạn...");

  Ticket.getUnpaidTickets((err, tickets) => {
    if (err) {
      console.error("❌ Lỗi khi lấy vé chưa thanh toán:", err);
      return;
    }

    if (!tickets.length) {
      console.log("✅ Không có vé hết hạn.");
      return;
    }

    const tripsToUpdate = {};

    tickets.forEach((ticket) => {
      const currentTime = moment();
      const expiresAt = moment(ticket.expires_at);

      if (currentTime.isAfter(expiresAt)) {
        console.log(`⚠️ Vé ${ticket.ticket_id} hết hạn`);

        if (!tripsToUpdate[ticket.trip_id]) {
          tripsToUpdate[ticket.trip_id] = [];
        }

        tripsToUpdate[ticket.trip_id].push(ticket);
      }
    });

    Object.keys(tripsToUpdate).forEach((tripId) => {
      db.getConnection((err, connection) => {
        if (err) {
          console.error("❌ Lỗi kết nối MySQL:", err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            console.error("❌ Lỗi bắt đầu giao dịch:", err);
            return;
          }

          Trip.getTripById(tripId, (err, results) => {
            if (err || !results.length) {
              connection.rollback(() => {
                connection.release();
                console.error(`❌ Lỗi lấy chuyến đi ${tripId}:`, err);
              });
              return;
            }

            let seats = Array.isArray(results[0].seats)
              ? results[0].seats
              : JSON.parse(results[0].seats || "[]");

            tripsToUpdate[tripId].forEach((ticket) => {
              const seatNumbers = ticket.seat_number.split(",");

              seats = seats.map((seat) => {
                if (seatNumbers.includes(seat.seat_number)) {
                  seat.status = "available";
                }
                return seat;
              });
            });

            Trip.updateTripSeats(tripId, seats, (err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error(
                    `❌ Lỗi cập nhật ghế cho chuyến ${tripId}:`,
                    err
                  );
                });
              }

              const ticketIds = tripsToUpdate[tripId].map((t) => t.ticket_id);

              Ticket.updateMultipleTicketStatus(
                ticketIds,
                "Hủy đặt vé do chưa thanh toán",
                (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error(`❌ Lỗi cập nhật trạng thái vé:`, err);
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error("❌ Lỗi khi commit giao dịch:", err);
                      });
                    }

                    connection.release();
                    console.log(
                      `✅ Đã hủy ${ticketIds.length} vé trên chuyến đi ${tripId}`
                    );
                  });
                }
              );
            });
          });
        });
      });
    });
  });
}

module.exports = { startExpireTicketsJob };
