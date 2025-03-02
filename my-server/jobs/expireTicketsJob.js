const Ticket = require("../src/models/ticketsModel");
const Trip = require("../src/models/tripsModel");
const moment = require("moment");

async function startExpireTicketsJob() {
  console.log("🔄 Kiểm tra vé hết hạn...");

  try {
    const tickets = await new Promise((resolve, reject) => {
      Ticket.getUnpaidTickets((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (!tickets.length) {
      console.log("✅ Không có vé nào cần hủy.");
      return;
    }

    const tripsToUpdate = {};

    tickets.forEach((ticket) => {
      const currentTime = moment();
      const expiresAt = moment(ticket.expires_at);

      if (currentTime.isAfter(expiresAt)) {
        console.log(`⏳ Vé ${ticket.ticket_id} đã hết hạn`);
        if (!tripsToUpdate[ticket.trip_id]) tripsToUpdate[ticket.trip_id] = [];
        tripsToUpdate[ticket.trip_id].push(ticket);
      }
    });

    if (Object.keys(tripsToUpdate).length === 0) {
      console.log("✅ Không có chuyến xe nào cần cập nhật.");
      return;
    }

    await Promise.all(
      Object.keys(tripsToUpdate).map(async (tripId) => {
        try {
          const trip = await new Promise((resolve, reject) => {
            Trip.getTripById(tripId, (err, data) => {
              if (err) reject(err);
              else resolve(data[0]); // Fix: Trả về chính xác object
            });
          });

          if (!trip) {
            console.error(`⚠️ Không tìm thấy chuyến đi ${tripId}`);
            return;
          }

          console.log(`📌 Trip ${tripId} - seats data từ DB:`, trip.seats);

          let seats;
          if (typeof trip.seats === "string") {
            try {
              seats = JSON.parse(trip.seats);
            } catch (error) {
              console.error(
                `❌ Lỗi khi parse JSON seats của trip ${tripId}:`,
                error
              );
              return;
            }
          } else if (Array.isArray(trip.seats)) {
            seats = trip.seats; // Nếu đã là array thì giữ nguyên
          } else {
            console.error(`❌ Dữ liệu seats của trip ${tripId} không hợp lệ`);
            return;
          }

          console.log(`📌 Ghế trước khi cập nhật trip ${tripId}:`, seats);

          // Cập nhật trạng thái ghế
          const updatedSeats = seats.map((seat) => {
            tripsToUpdate[tripId].forEach((ticket) => {
              let seatNumbers = ticket.seat_number
                ? ticket.seat_number.split(",").map((s) => s.trim())
                : [];
              if (seatNumbers.includes(seat.seat_number)) {
                seat.status = "available";
              }
            });
            return seat;
          });

          console.log(`🚀 Ghế sau khi cập nhật trip ${tripId}:`, updatedSeats);

          await Promise.all([
            new Promise((resolve, reject) => {
              Trip.updateTripSeats(
                tripId,
                JSON.stringify(updatedSeats),
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            }),
            ...tripsToUpdate[tripId].map(
              (ticket) =>
                new Promise((resolve, reject) => {
                  Ticket.updateTicketStatus(
                    {
                      ticket_id: ticket.ticket_id,
                      status: "Hủy đặt vé do chưa thanh toán",
                    },
                    (err) => {
                      if (err) {
                        console.error(
                          `❌ Lỗi cập nhật vé ${ticket.ticket_id}:`,
                          err
                        );
                        reject(err);
                      } else {
                        console.log(`✅ Vé ${ticket.ticket_id} đã bị hủy.`);
                        resolve();
                      }
                    }
                  );
                })
            ),
          ]);
        } catch (error) {
          console.error(`❌ Lỗi khi xử lý chuyến xe ${tripId}:`, error);
        }
      })
    );

    console.log("✅ Đã xử lý tất cả vé hết hạn.");
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra vé hết hạn:", error);
  }
}

module.exports = { startExpireTicketsJob };
