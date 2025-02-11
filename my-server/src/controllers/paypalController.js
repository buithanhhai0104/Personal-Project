const { getPayPalToken } = require("../utils/paypal");
const axios = require("axios");

const PAYPAL_API = process.env.PAYPAL_API;

// Tạo yêu cầu thanh toán (Sandbox)
const createPayment = async (req, res) => {
  const { total, currency } = req.body;

  try {
    const token = await getPayPalToken();

    const paymentData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency || "VND",
            value: total,
          },
        },
      ],
    };

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error.response.data);
    res.status(500).json({ error: "Không thể tạo thanh toán" });
  }
};

// Xác nhận thanh toán (Sandbox)
const capturePayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const token = await getPayPalToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Lỗi khi xác nhận thanh toán:", error.response.data);
    res.status(500).json({ error: "Không thể xác nhận thanh toán" });
  }
};

module.exports = { createPayment, capturePayment };
