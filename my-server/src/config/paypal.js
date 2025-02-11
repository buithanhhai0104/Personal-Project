const paypal = require("@paypal/checkout-server-sdk");

// Cấu hình môi trường PayPal
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  return process.env.PAYPAL_ENVIRONMENT === "sandbox"
    ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
    : new paypal.core.LiveEnvironment(clientId, clientSecret);
}

// Tạo client PayPal
function paypalClient() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { paypalClient };
