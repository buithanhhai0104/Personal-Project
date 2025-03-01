const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Resend } = require("resend");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const authController = require("./src/controllers/authController");
const tripRoutes = require("./src/routes/tripRoutes");
const ticketsRoutes = require("./src/routes/ticketsRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
const paypalRoutes = require("./src/routes/paypalRoutes");
const { startExpireTicketsJob } = require("./jobs/expireTicketsJob");

const app = express();
const port = process.env.PORT || 4000;

// Các domain được phép truy cập vào backend
const allowedOrigins = [
  "https://personal-project-rlxh.vercel.app",
  "https://backend-personal-project.vercel.app",
  "http://localhost:3000",
];

// Cấu hình CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Chấp nhận yêu cầu từ các origin trong danh sách allowedOrigins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Không được phép từ origin này"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Các phương thức được phép
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Allow-Credentials",
    ],

    credentials: true, // Quan trọng nếu sử dụng cookies
  })
);

// Middleware khác
app.use(express.json());
app.use(cookieParser());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Kiểm tra request đầu vào

    const { to, subject, tickets } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (
      !to ||
      !subject ||
      typeof tickets !== "object" ||
      Array.isArray(tickets)
    ) {
      console.error("Dữ liệu không hợp lệ:", req.body);
      return res.status(400).json({ error: "Dữ liệu gửi email không hợp lệ" });
    }
    // Gửi email với từng vé
    const emailContent = `
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <p><strong>Mã vé:</strong> ${tickets.ticket_id}</p>
        <p><strong>Điểm đi:</strong> ${tickets.from_location}</p>
        <p><strong>Điểm đến:</strong> ${tickets.to_location}</p>
        <p><strong>Mã chuyến đi:</strong> ${tickets.trip_id}</p>
        <p><strong>Họ và tên:</strong> ${tickets.name}</p>
        <p><strong>Số điện thoại:</strong> ${tickets.phone}</p>
        <p><strong>Email:</strong> ${tickets.email}</p>
        <p><strong>Số ghế:</strong> ${tickets.seat_number}</p>
      </div>
    `;

    // Gửi email
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject: subject,
      html: emailContent,
    });

    res.json({ message: "Email sent successfully!", data });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: error.message });
  }
});

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
app.get("/api/run-cron", (req, res) => {
  try {
    startExpireTicketsJob();
    res.status(200).json({ message: "Cron job đã được kích hoạt thành công" });
  } catch (error) {
    console.error("Lỗi khi chạy cron job:", error);
    res.status(500).json({ error: "Lỗi khi chạy cron job" });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
