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
  "https://localhost:3000",
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
    const { to, subject, bookTicketData } = req.body;

    console.log("Request Body:", req.body);

    if (!Array.isArray(bookTicketData) || bookTicketData.length === 0) {
      return res.status(400).json({ error: "Dữ liệu vé không hợp lệ" });
    }

    // Tạo nội dung email bằng cách map dữ liệu bookTicketData
    const ticketHTML = bookTicketData
      .map(
        (ticket) => `
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); background-color: #f9f9f9; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 14px; font-weight: 500; color: #000;">
            Mã vé: <b>${
              ticket.ticket_id
            }</b> (có thể dùng mã vé để tra cứu vé trên hệ thống)
          </span>
        </div>
        <div style="margin-top: 8px; color: #4a4a4a;">
          <p><strong>Điểm đi:</strong> ${ticket.from_location}</p>
          <p><strong>Điểm đến:</strong> ${ticket.to_location}</p>
          <p><strong>Mã chuyến đi:</strong> ${ticket.trip_id}</p>
          <p><strong>Họ và tên:</strong> ${ticket.name}</p>
          <p><strong>Số điện thoại:</strong> ${ticket.phone}</p>
          <p><strong>Email:</strong> ${ticket.email}</p>
          <p><strong>Số ghế:</strong> ${ticket.seat_number}</p>
          <p><strong>Trạng thái thanh toán:</strong> 
            <span style="color: ${
              ticket.status === "Đã thanh toán" ? "green" : "red"
            }; font-weight: bold;">
              ${ticket.status}
            </span>
          </p>
        </div>
      </div>
    `
      )
      .join(""); // Nối tất cả nội dung email thành một chuỗi HTML

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #007bff; text-align: center;">Thông tin đặt vé</h2>
            ${ticketHTML}
            <p style="text-align: center; margin-top: 20px;">
              <a href="https://personal-project-rlxh.vercel.app/check" 
                style="display: inline-block; padding: 10px 20px; color: white; background: #007bff; text-decoration: none; border-radius: 5px;">
                Kiểm tra vé tại đây
              </a>
            </p>
          </div>
        </div>
      `,
    });

    res.json({ message: "Email sent successfully!", data });
  } catch (error) {
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

// Khởi tạo Resend với API Key

// Lắng nghe trên cổng
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
