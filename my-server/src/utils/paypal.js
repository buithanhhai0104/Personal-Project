const axios = require("axios");

// URL API từ môi trường
const PAYPAL_API = process.env.PAYPAL_API;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Lấy token từ PayPal Sandbox
const getPayPalToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Lỗi khi lấy token PayPal:", error.response.data);
    throw new Error("Không thể lấy token PayPal");
  }
};

module.exports = { getPayPalToken };
