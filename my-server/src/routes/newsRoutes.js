const express = require("express");
const NewsController = require("../controllers/newsController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", NewsController.getAllNews);
router.get("/:id", NewsController.getNewsById);
router.post("/", upload.single("image"), NewsController.createNews);
router.put("/:id", upload.single("image"), NewsController.updateNewsById);
router.delete("/:id", NewsController.deleteNewsById);

module.exports = router;
