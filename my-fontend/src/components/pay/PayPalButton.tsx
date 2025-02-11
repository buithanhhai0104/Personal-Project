import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (details: unknown) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = "USD",
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency,
      }}
    >
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <PayPalButtons
        createOrder={async () => {
          setLoading(true);
          try {
            const response = await axios.post(
              "http://localhost:4000/paypal/create-payment",
              {
                total: amount,
                currency,
              }
            );
            setLoading(false);
            return response.data.id;
          } catch (err) {
            setLoading(false);
            console.log(err);
            setError("Không thể tạo đơn hàng thanh toán.");
            throw new Error("Error creating PayPal order");
          }
        }}
        onApprove={async (data) => {
          setLoading(true);
          try {
            const response = await axios.post(
              `http://localhost:4000/paypal/capture-payment/${data.orderID}`
            );
            setLoading(false);
            onSuccess(response.data);
          } catch (err) {
            setLoading(false);
            setError("Không thể xác nhận thanh toán.");
            console.log(err);
          }
        }}
        onError={(err) => {
          setError("Có lỗi xảy ra trong quá trình thanh toán.");
          console.error(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
