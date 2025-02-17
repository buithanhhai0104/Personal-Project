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
  "https://personal-project-rlxh.vercel.app",
  "https://server-penal-project-git-e4d4fd-thanh-hais-projects-0e39a8d1.vercel.app",
  "https://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json()); // Thay thế body-parser
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
