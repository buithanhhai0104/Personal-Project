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
          if (!Array.isArray(seats))
            throw new Error("Dữ liệu seats không hợp lệ");
        } catch (error) {
          console.error(
            `Lỗi khi parse danh sách ghế của chuyến ${tripId}:`,
            error
          );
          return;
        }

        const ticketsForTrip = tripsToUpdate[tripId];

        ticketsForTrip.forEach((ticket) => {
          let seatNumbers = (ticket.seat_numbers ?? "")
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "");

          seats = seats.map((seat) => {
            if (seatNumbers.includes(seat.seat_number)) {
              return { ...seat, status: "available" };
            }
            return seat;
          });

          console.log(`Sau khi cập nhật, seats (tripId: ${tripId}):`, seats);

          Trip.updateTripSeats(tripId, JSON.stringify(seats), (err) => {
            if (err) {
              console.error(
                `Lỗi khi cập nhật ghế cho chuyến đi ${tripId}:`,
                err
              );
              return;
            }

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
