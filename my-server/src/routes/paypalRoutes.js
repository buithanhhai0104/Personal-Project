const express = require("express");
const {
  createPayment,
  capturePayment,
} = require("../controllers/paypalController");

const router = express.Router();

router.post("/create-payment", createPayment);
router.post("/capture-payment/:orderId", capturePayment);

module.exports = router;
