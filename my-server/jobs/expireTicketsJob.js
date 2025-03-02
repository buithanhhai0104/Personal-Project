const Ticket = require("../src/models/ticketsModel");
const Trip = require("../src/models/tripsModel");
const moment = require("moment");

function startExpireTicketsJob() {
  console.log("Kiểm tra vé hết hạn...");

  Ticket.getUnpaidTickets((err, tickets) => {
    if (err) {
      console.error("Lỗi khi lấy vé chưa thanh toán:", err);
      return;
    }

    const tripsToUpdate = {};

    tickets.forEach((ticket) => {
      const currentTime = moment();
      const expiresAt = moment(ticket.expires_at);

      if (currentTime.isAfter(expiresAt)) {
        console.log(`Vé ${ticket.ticket_id} hết hạn`);
        if (!tripsToUpdate[ticket.trip_id]) {
          tripsToUpdate[ticket.trip_id] = [];
        }
        tripsToUpdate[ticket.trip_id].push(ticket);
      }
    });

    Object.keys(tripsToUpdate).forEach((tripId) => {
      Trip.getTripById(tripId, (err, results) => {
        console.log(results);
        if (err) {
          console.error(`Lỗi khi lấy thông tin chuyến đi: ${tripId}`, err);
          return;
        }

        if (!results || results.length === 0) {
          console.error(`Không tìm thấy chuyến đi: ${tripId}`);
          return;
        }

        let trip = results[0];
        let seats;

        try {
          seats =
            typeof trip.seats === "string"
              ? JSON.parse(trip.seats)
              : trip.seats;
          console.log(seats);
          if (!Array.isArray(seats))
            throw new Error("Dữ liệu seats không hợp lệ");
        } catch (error) {
          console.error(
            `Lỗi khi parse danh sách ghế của chuyến ${tripId}:`,
            error
          );
          return;
        }

        tripsToUpdate[tripId].forEach((ticket) => {
          console.log(ticket.seat_numbers);
          let seatNumbers =
            typeof ticket.seat_numbers === "string"
              ? ticket.seat_numbers.split(",").map((s) => s.trim())
              : [];
          console.log(seatNumbers);
          // Cập nhật trạng thái ghế
          let currentSeats = seats.map((seat) => {
            if (seatNumbers.includes(seat.seat_number)) {
              seat.status = "available";
            }
            return seat;
          });

          console.log(
            `Seats sau khi cập nhật cho trip ${tripId}:`,
            JSON.stringify(currentSeats)
          );

          // Cập nhật ghế trước khi cập nhật trạng thái vé
          Trip.updateTripSeats(tripId, JSON.stringify(currentSeats), (err) => {
            console.log("curunentSeats", currentSeats);
            if (err) {
              console.error(
                `Lỗi khi cập nhật ghế cho chuyến đi ${tripId}:`,
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
                    `Lỗi khi cập nhật trạng thái vé ${ticket.ticket_id}:`,
                    err
                  );
                  return;
                }
                console.log(
                  `Vé ${ticket.ticket_id} đã bị hủy do chưa thanh toán.`
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
