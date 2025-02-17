const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

exports.register = async (req, res) => {
  const { name, email, username, password } = req.body;
  if (!username || !password || !name || !email) {
    return res
      .status(400)
      .json({ message: "Username và password là bắt buộc" });
  }

  User.findByUsernameAndEmail(username, email, async (error, results) => {
    if (error)
      return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu" });

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Username hoặc email đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    User.createAccount(
      { name, email, username, password: hashedPassword },
      (err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.status(201).json({ message: "Đăng ký thành công!" });
      }
    );
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, async (error, results) => {
    if (error)
      return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
    if (results.length === 0) {
      return res.status(400).json({ message: "tài khoản không tồn tại" });
    }
    const hashedPassword = results[0].password;
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) {
        return res.status(400).json({ message: "Sai mật khẩu" });
      }
      const token = jwt.sign(
        {
          username: results[0].username,
          id: results[0].id,
          role: results[0].role,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      if (results[0].role === "admin") {
        res.cookie("authToken", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        res.cookie("authToken", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 3600000,
        });
      }

      // Nếu mật khẩu đúng
      res.status(200).json({
        message: "Đăng nhập thành công!",
        userdata: {
          full_name: results[0].name,
          username: results[0].username,
          id: results[0].id,
          role: results[0].role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
    }
  });
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(403).json({ message: "Không có token" });
  }

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    req.user = decoded;
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
};

exports.logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  res.status(200).json({ message: "Đăng xuất thành công!" });
};
