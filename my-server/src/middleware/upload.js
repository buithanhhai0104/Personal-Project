const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "news", // Tên thư mục trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Định dạng cho phép
  },
});

const upload = multer({ storage });

module.exports = upload;
