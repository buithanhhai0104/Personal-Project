async function startExpireTicketsJob() {
  console.log("🔄 Kiểm tra vé hết hạn...");

  Ticket.getUnpaidTickets(async (err, tickets) => {
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

    for (const tripId of Object.keys(tripsToUpdate)) {
      try {
        const connection = await db.promise().getConnection();
        await connection.beginTransaction();

        const [results] = await connection.query(
          `SELECT seats FROM trips WHERE trip_id = ?`,
          [tripId]
        );

        if (!results.length) {
          throw new Error(`Không tìm thấy chuyến đi ${tripId}`);
        }

        let seats = JSON.parse(results[0].seats || "[]");

        tripsToUpdate[tripId].forEach((ticket) => {
          const seatNumbers = ticket.seat_number.split(",");

          seats = seats.map((seat) => {
            if (seatNumbers.includes(seat.seat_number)) {
              seat.status = "available";
            }
            return seat;
          });
        });

        await connection.query(`UPDATE trips SET seats = ? WHERE trip_id = ?`, [
          JSON.stringify(seats),
          tripId,
        ]);

        const ticketIds = tripsToUpdate[tripId].map((t) => t.ticket_id);

        await Ticket.updateMultipleTicketStatus(
          ticketIds,
          "Hủy đặt vé do chưa thanh toán"
        );

        await connection.commit();
        connection.release();
        console.log(
          `✅ Đã hủy ${ticketIds.length} vé trên chuyến đi ${tripId}`
        );
      } catch (err) {
        console.error(`❌ Lỗi xử lý vé hết hạn cho chuyến ${tripId}:`, err);
      }
    }
  });
}
