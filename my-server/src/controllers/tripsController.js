const Trip = require("../models/tripsModel");
const db = require("../config/db");
const generateDefaultSeats = require("../helpers/seatHelpers");
const tripController = {
  getAllTrips: (req, res) => {
    Trip.getAllTrips((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  },
  getTripById: (req, res) => {
    const tripId = req.params.id;
    Trip.getTripById(tripId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Trip not found" });

      const trip = results[0];
      try {
        trip.seats =
          typeof trip.seats === "string" ? JSON.parse(trip.seats) : trip.seats;
      } catch (parseError) {
        return res.status(500).json({ error: "Failed to parse seats data" });
      }
      res.status(200).json(trip);
    });
  },

  createTrip: (req, res) => {
    console.log(" data:", req.body);
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
    } = req.body;

    if (
      !from_location ||
      !to_location ||
      !departure_time ||
      !start_time ||
      !arrival_time ||
      !bus_type ||
      !price ||
      !travel_time
    ) {
      return res.status(400).json({ error: "Thiếu thông tin chuyến xe!" });
    }

    const convertDateFormat = (date) => {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    };

    const formattedDepartureTime = convertDateFormat(departure_time);

    const defaultSeats = seats || generateDefaultSeats(bus_type);

    const tripData = {
      from_location,
      to_location,
      departure_time: formattedDepartureTime,
      start_time,
      arrival_time,
      bus_type,
      price,
      travel_time,
      seats: defaultSeats,
    };
    Trip.createTrip(tripData, (err, results) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res
        .status(201)
        .json({ message: "Trip created successfully", id: results.insertId });
    });
  },

  updateTrip: (req, res) => {
    const tripId = req.params.id;
    Trip.updateTrip(tripId, req.body, (err, results) => {
      if (err) return res.status(400).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Trip not found" });
      res.status(200).json({ message: "Trip updated successfully" });
    });
  },

  deleteTrip: (req, res) => {
    const tripId = req.params.id;
    Trip.deleteTrip(tripId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Trip not found" });
      res.status(200).json({ message: "Trip deleted successfully" });
    });
  },

  updateTripSeats: (req, res) => {
    const tripId = req.params.id;
    const { seats } = req.body;

    if (!seats) {
      return res.status(400).json({ error: "Missing seat information" });
    }

    Trip.updateTripSeats(tripId, seats, (err, results) => {
      if (err) return res.status(400).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Trip not found" });

      res.status(200).json({ message: "Seats updated successfully" });
    });
  },

  searchTrips: (req, res) => {
    const { from_location, to_location, departure_date } = req.query;
    const query = `
    SELECT * FROM trips
    WHERE LOWER(from_location) LIKE LOWER(?) 
    AND LOWER(to_location) LIKE LOWER(?) 
    AND departure_time = ?;
  `;

    db.query(
      query,
      [`%${from_location}%`, `%${to_location}%`, departure_date],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error." });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json(results);
      }
    );
  },
};

module.exports = tripController;
