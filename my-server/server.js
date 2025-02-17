const express = require("express");
require("dotenv").config();
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
const port = process.env.PORTDB_PORT || 4000;

const allowedOrigins = [
  "https://personal-project-rlxh.vercel.app", // Dự án frontend
  "https://server-personal-project-67d0v7vmx-thanh-hais-projects-0e39a8d1.vercel.app", // Server backend
  "https://localhost:3000", // Localhost (nếu cần)
];

// Cấu hình CORS
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin); // Ghi lại origin cho mục đích debug
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Không được phép từ origin này"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Quan trọng nếu bạn gửi cookies từ client
  })
);

// Các middleware khác
app.use(express.json());
app.use(cookieParser());

// Các route của ứng dụng
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api", tripRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/news", newsRoutes);
app.use("/paypal", paypalRoutes);

// Endpoint lấy thông tin người dùng sau khi xác thực
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

// Job xử lý vé hết hạn
startExpireTicketsJob();

// Lắng nghe trên cổng
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
