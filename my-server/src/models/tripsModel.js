const db = require("../config/db");

const Trip = {
  // 1. Lấy tất cả chuyến xe
  getAllTrips: (callback) => {
    const sql = "SELECT * FROM trips";
    db.query(sql, callback);
  },

  // 2. Lấy chuyến xe theo ID
  getTripById: (tripId, callback) => {
    const sql = "SELECT * FROM trips WHERE id = ?";
    db.query(sql, [tripId], callback);
  },

  // 3. Thêm chuyến xe mới
  createTrip: (tripData, callback) => {
    const {
      from_location,
      to_location,
      departure_time,
      start_time,
      arrival_time,
      bus_type,
      price,
      travel_time,
      seats,
    } = tripData;
    const query = `
      INSERT INTO trips (from_location, to_location, departure_time, start_time, arrival_time, bus_type, price, travel_time, seats)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    db.query(
      query,
      [
        from_location,
        to_location,
        departure_time,
        start_time,
        arrival_time,
        bus_type,
        price,
        travel_time,
        JSON.stringify(seats),
      ],
      callback
    );
  },

  // 4. Cập nhật thông tin chuyến xe
  updateTrip: (id, data, callback) => {
    const {
      from_location,
      to_location,
      departure_time,
      start_time,
      arrival_time,
      bus_type,
      price,
      travel_time,
    } = data;

    const sql = `
      UPDATE trips 
      SET 
        from_location = ?, 
        to_location = ?, 
        departure_time = ?, 
        start_time = ?, 
        arrival_time = ?, 
        bus_type = ?, 
        price = ?, 
        travel_time = ? 
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        from_location,
        to_location,
        departure_time,
        start_time,
        arrival_time,
        bus_type,
        price,
        travel_time,
        id,
      ],
      callback
    );
  },

  updateTripSeats: (trip_id, seats, callback) => {
    let seatsData;
    try {
      seatsData = JSON.stringify(seats);
    } catch (error) {
      return callback(error);
    }

    const query = `UPDATE trips SET seats = ? WHERE trip_id = ?`;
    db.query(query, [seatsData, trip_id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  getSeatsByTripId: async (tripId) => {
    const [rows] = await db.query("SELECT seats FROM trips WHERE id = ?", [
      tripId,
    ]);
    return rows.length ? rows[0] : null;
  },

  deleteTrip: (id, callback) => {
    const sqlDeleteTickets = "DELETE FROM tickets WHERE trip_id = ?";
    const sqlDeleteTrip = "DELETE FROM trips WHERE id = ?";

    // Xóa vé trước
    db.query(sqlDeleteTickets, [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      // Sau khi xóa vé, tiếp tục xóa chuyến xe
      db.query(sqlDeleteTrip, [id], callback);
    });
  },

  getTripsBySearch: (from_location, to_location, departure_date, callback) => {
    const sql = `
      SELECT * FROM trips
      WHERE LOWER(from_location) = LOWER(?) 
        AND LOWER(to_location) = LOWER(?) 
        AND departure_time = ?`;
    db.query(sql, [from_location, to_location, departure_date], callback);
  },
};

module.exports = Trip;
