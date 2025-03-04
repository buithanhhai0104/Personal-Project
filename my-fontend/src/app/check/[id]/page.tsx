"use client";
import React, { useEffect, useState } from "react";
import { IBookTicket } from "@/types/bookTickets";
import { checkTickets } from "@/service/ticketsService";
import { handlePaymentSuccess } from "@/utils/paymentUtils";
import CountdownTimer from "@/components/countdownTimer";
import PayPalButton from "@/components/pay/PayPalButton";
import { ClipLoader } from "react-spinners";

const TripInformation = ({ params }: { params: Promise<{ id: string }> }) => {
  const [ticketData, setTicketData] = useState<IBookTicket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentTimeExpires, setPaymentTimeExpires] = useState<boolean>(true);

  const resolvedParams = React.use(params);
  const { id } = resolvedParams || {};

  useEffect(() => {
    const getTicketById = async () => {
      setLoading(true);
      try {
        const res = await checkTickets(id);
        if (res && res.ticket_id) {
          setTicketData(res);
        } else {
          setTicketData(null);
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm vé:", err);
        setTicketData(null);
      } finally {
        setLoading(false);
      }
    };
    getTicketById();
  }, [id]);

  const handlePayment = async (details: unknown) => {
    if (!ticketData) return;
    const result = await handlePaymentSuccess(ticketData);
    console.log(result, details);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 py-10">
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#007bff" size={50} />
        </div>
      ) : ticketData ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-orange-600 text-center mb-6">
            Chi tiết vé
          </h1>
          <div className="space-y-4">
            <InfoRow label="Mã số vé" value={ticketData.ticket_id ?? "N/A"} />
            <InfoRow label="Mã số xe" value={ticketData.trip_id ?? "N/A"} />
            <InfoRow label="Tên khách hàng" value={ticketData.name ?? "N/A"} />
            <InfoRow
              label="Mã số ghế"
              value={ticketData.seat_number ?? "N/A"}
            />
            <InfoRow label="Email" value={ticketData.email ?? "N/A"} />
            <InfoRow
              label="Thời gian đặt vé"
              value={
                ticketData.booking_time
                  ? new Date(ticketData.booking_time).toLocaleString("vi-VN")
                  : "N/A"
              }
            />
            <InfoRow label="Số điện thoại" value={ticketData.phone ?? "N/A"} />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Trạng thái thanh toán:
              </span>
              <span
                className={
                  ticketData.status === "Đã thanh toán"
                    ? "text-green-400"
                    : "text-red-600"
                }
              >
                {ticketData.status}
              </span>
            </div>
            {ticketData.status === "Chưa thanh toán" && (
              <div className="flex flex-col">
                <div className="text-[14px] flex flex-col sm:flex-row gap-3 text-black p-2">
                  Vui lòng thanh toán trong:
                  <span className="text-red-600 flex gap-1">
                    <CountdownTimer
                      seatExpiresAt={ticketData.expires_at || ""}
                      setPaymentTimeExpires={setPaymentTimeExpires}
                    />
                    (Nếu không thanh toán trong thời gian quy định vé sẽ hủy)
                  </span>
                </div>
                {paymentTimeExpires ? (
                  <div className="text-center mt-8 w-full flex flex-col items-center gap-2 text-xl">
                    <PayPalButton
                      amount={300}
                      currency="USD"
                      onSuccess={handlePayment}
                    />
                  </div>
                ) : (
                  <div className="w-full text-red-600 text-center mt-4">
                    Vé của bạn đã hết hạn do chưa thanh toán trong thời gian quy
                    định.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-600">Không tìm thấy thông tin vé.</p>
      )}
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <div className="flex justify-between items-center">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-900">{value || "N/A"}</span>
  </div>
);

export default TripInformation;
