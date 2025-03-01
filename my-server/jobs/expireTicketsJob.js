const Ticket = require("../src/models/ticketsModel");
const Trip = require("../src/models/tripsModel");
const moment = require("moment");

function startExpireTicketsJob() {
  console.log("🚀 Bắt đầu kiểm tra vé hết hạn...");

  Ticket.getUnpaidTickets((err, tickets) => {
    if (err) {
      console.error("❌ Lỗi khi lấy vé chưa thanh toán:", err);
      return;
    }

    console.log(`📌 Tổng số vé chưa thanh toán: ${tickets.length}`);
    if (tickets.length === 0) return;

    const tripsToUpdate = {};

    tickets.forEach((ticket) => {
      console.log(`🎟 Kiểm tra vé ID: ${ticket.ticket_id}`);

      const currentTime = moment();
      const expiresAt = moment(ticket.expires_at);

      if (currentTime.isAfter(expiresAt)) {
        console.log(`⏳ Vé ${ticket.ticket_id} đã hết hạn!`);
        if (!tripsToUpdate[ticket.trip_id]) {
          tripsToUpdate[ticket.trip_id] = [];
        }
        tripsToUpdate[ticket.trip_id].push(ticket);
      }
    });

    console.log(
      `📌 Cần cập nhật ${Object.keys(tripsToUpdate).length} chuyến đi.`
    );

    Object.keys(tripsToUpdate).forEach((tripId) => {
      console.log(`🔍 Lấy dữ liệu chuyến đi ID: ${tripId}`);
      Trip.getTripById(tripId, (err, results) => {
        if (err) {
          console.error(`❌ Lỗi khi lấy chuyến đi ${tripId}:`, err);
          return;
        }

        if (!results || results.length === 0) {
          console.error(`⚠️ Không tìm thấy chuyến đi ${tripId}`);
          return;
        }

        let trip = results[0];
        let seats;

        try {
          console.log(`📌 Dữ liệu seats của chuyến ${tripId}:`, trip.seats);

          seats =
            typeof trip.seats === "string"
              ? JSON.parse(trip.seats)
              : trip.seats;
          if (!Array.isArray(seats))
            throw new Error("❌ Dữ liệu seats không hợp lệ!");
        } catch (error) {
          console.error(
            `⚠️ Lỗi khi parse danh sách ghế của chuyến ${tripId}:`,
            error
          );
          return;
        }

        console.log(`✅ Tổng số ghế trong trip ${tripId}: ${seats.length}`);

        tripsToUpdate[tripId].forEach((ticket) => {
          console.log(`🎟 Xử lý vé: ${ticket.ticket_id}`);

          let seatNumbers = [];
          try {
            if (typeof ticket.seat_numbers === "string") {
              seatNumbers = JSON.parse(ticket.seat_numbers);
            }
          } catch (error) {
            seatNumbers = ticket.seat_numbers.split(",").map((s) => s.trim());
          }

          console.log(`📌 Ghế cần cập nhật:`, seatNumbers);

          if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
            console.error(`⚠️ Vé ${ticket.ticket_id} không có số ghế hợp lệ.`);
            return;
          }

          let updatedSeats = seats.map((seat) => {
            if (seatNumbers.includes(seat.seat_number)) {
              seat.status = "available";
            }
            return seat;
          });

          console.log(
            `🔄 Seats sau khi cập nhật cho trip ${tripId}:`,
            JSON.stringify(updatedSeats)
          );

          Trip.updateTripSeats(tripId, JSON.stringify(updatedSeats), (err) => {
            if (err) {
              console.error(
                `❌ Lỗi khi cập nhật ghế cho chuyến đi ${tripId}:`,
                err
              );
              return;
            }

            console.log(
              `✅ Ghế của chuyến ${tripId} đã được cập nhật thành công!`
            );

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
                  `🚫 Vé ${ticket.ticket_id} đã bị hủy do chưa thanh toán.`
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
