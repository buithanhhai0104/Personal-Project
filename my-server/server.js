const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const authController = require("./src/controllers/authController");
const tripRoutes = require("./src/routes/tripRoutes");
const ticketsRoutes = require("./src/routes/ticketsRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
const paypalRoutes = require("./src/routes/paypalRoutes");
const startExpireTicketsJob = require("./jobs/expireTicketsJob");
const app = express();
const port = process.env.PORTDB_PORT || 3307;

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Cho phép frontend kết nối
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ Quan trọng: Cho phép gửi cookies/token
  })
);

// Xử lý preflight request (OPTIONS)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api", tripRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/news", newsRoutes);
app.use("/paypal", paypalRoutes);

app.get("/userinfo", authController.verifyToken, (req, res) => {
  res.status(200).json({
    message: "Thông tin người dùng",
    userdata: {
      username: req.user.username,
      id: req.user.id,
      role: req.user.role,
    },
  });
});

startExpireTicketsJob();

// Server listening
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
