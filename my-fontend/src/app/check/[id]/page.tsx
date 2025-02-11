"use client";

import React, { useEffect, useState } from "react";
import { IBookTicket } from "@/types/bookTickets";
import { checkTickets } from "@/service/ticketsService";
import { handlePaymentSuccess } from "@/utils/paymentUtils";
import CountdownTimer from "@/components/countdownTimer";
import PayPalButton from "@/components/pay/PayPalButton";
const TripInfomation = ({ params }: { params: Promise<{ id: string }> }) => {
  const [ticketData, setTicketData] = useState<IBookTicket[] | null>(null);
  const resolvedParams = React.use(params);
  const { id } = resolvedParams || {};
  console.log(id);
  useEffect(() => {
    const getTicketById = async () => {
      try {
        const res = await checkTickets(id);
        setTicketData([res]);
      } catch (err) {
        console.log("Lỗi tìm kiếm vé", err);
      }
    };
    getTicketById();
  }, [id]);

  const handlePayment = async (details: unknown) => {
    const result = await handlePaymentSuccess(ticketData);
    console.log(result, details);
  };
  console.log(ticketData);
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 py-10">
      {ticketData && ticketData.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-orange-600 text-center mb-6">
            Chi tiết vé
          </h1>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Mã số vé:</span>
              <span className="text-gray-900">{ticketData[0]?.ticket_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Mã số xe:</span>
              <span className="text-gray-900">{ticketData[0]?.trip_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Tên khách hàng:
              </span>
              <span className="text-gray-900">{ticketData[0]?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Mã số ghế:</span>
              <span className="text-gray-900">
                {ticketData[0]?.seat_number}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-900">{ticketData[0]?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Thời gian đặt vé:
              </span>
              <span className="text-gray-900">
                {ticketData[0].booking_time
                  ? new Date(ticketData[0].booking_time).toLocaleString("vi-VN")
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Số điện thoại:
              </span>
              <span className="text-gray-900">{ticketData[0]?.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Trạng thái thanh toán:
              </span>
              <span
                className={
                  ticketData[0]?.status === "Đã thanh toán"
                    ? "text-green-400"
                    : "text-red-600"
                }
              >
                {ticketData[0]?.status}
              </span>
            </div>
            {ticketData[0]?.status === "Chưa thanh toán" && (
              <div className="flex flex-col">
                <div className="text-[14px] flex flex-col sm:flex-row gap-3 text-black p-2">
                  Vui lòng thanh toán trong:
                  <span className="text-red-600 flex gap-1">
                    <CountdownTimer seatExpiresAt={ticketData[0]?.expires_at} />{" "}
                    (Nếu không thanh toán trong thời gian quy định vé sẽ hủy)
                  </span>
                </div>
                <PayPalButton
                  amount={300}
                  currency="USD"
                  onSuccess={handlePayment}
                />
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

export default TripInfomation;
