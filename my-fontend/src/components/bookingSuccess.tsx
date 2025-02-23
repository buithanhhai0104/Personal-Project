"use client";
import { IBookTicket } from "@/types/bookTickets";
import React, { useState } from "react";
import PayPalButton from "./pay/PayPalButton";
import CountdownTimer from "./countdownTimer";
import { handlePaymentSuccess } from "@/utils/paymentUtils";
import { ITrips } from "@/types/trips";
import { ISendEmail } from "@/types/sendEmail";
import { apisendEmail } from "@/service/sendEmailService";
interface IBookingSuccessProps {
  bookTicketsData: IBookTicket[] | null;
  selectedSeats: string[];
  detailTrip: ITrips;
}

const BookingSuccess: React.FC<IBookingSuccessProps> = ({
  bookTicketsData,
  selectedSeats,
  detailTrip,
}) => {
  const totalAmount = detailTrip.price * selectedSeats.length;
  const [successfulPayment, setSuccessfulPayment] = useState<boolean>(false);

  const handlePayment = async (details: unknown) => {
    if (bookTicketsData) {
      const result = await handlePaymentSuccess(bookTicketsData);
      if (result) {
        setSuccessfulPayment(true);
        const sendEmailForm: ISendEmail = {
          to: bookTicketsData[0].email,
          subject: "Mã thông tin đặt vé ",
          tickets: bookTicketsData,
        };
        const sendEmail = await apisendEmail(sendEmailForm);
        if (sendEmail) {
          console.log("Đã gửi thông tin vé đến Email người đặt");
          console.log(sendEmailForm);
        }
      }
      console.log(result, details);
    }
  };

  return (
    <div className="min-h-screen w-[90%] sm:w-[60%] flex items-center justify-center">
      {successfulPayment ? (
        <div className="w-full overflow-auto bg-white shadow-custom rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-600">
              Thanh toán thành công
            </h1>
            <p className="text-gray-600 mt-2">
              Dưới đây là thông tin các vé bạn đã đặt:
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {bookTicketsData?.map((ticket, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg shadow-custom bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black">
                    Mã vé: <b>{ticket.ticket_id}</b> (có thể dùng mã vế để tra
                    cứu vé trên hệ thống)
                  </span>
                </div>
                <div className="mt-2 text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Họ và tên:</span>{" "}
                    {ticket.name}
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    {ticket.phone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {ticket.email}
                  </p>
                  <p>
                    <span className="font-medium">Số ghế:</span>{" "}
                    {ticket.seat_number}
                  </p>
                  <p>
                    <span className="font-medium">Chuyến đi:</span>{" "}
                    {ticket.trip_id}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái thanh toán:</span>{" "}
                    <span className="text-green-600">Đã thanh toán</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-auto bg-white shadow-custom rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-600">
              Đặt Vé Thành Công!
            </h1>
            <p className="text-gray-600 mt-2">
              Dưới đây là thông tin các vé của bạn :
            </p>
          </div>

          {/* Danh sách vé */}
          <div className="flex flex-col gap-3">
            {bookTicketsData?.map((ticket, index) => {
              const expiresAtLocal = new Date(
                ticket.expires_at + " UTC"
              ).toLocaleString();
              return (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg shadow-custom bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">
                      Mã vé: <b>{ticket.ticket_id}</b> (có thể dùng mã vé để tra
                      cứu vé trên hệ thống)
                    </span>
                  </div>
                  <div className="mt-2 text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Điểm đi:</span>{" "}
                      {ticket.from_location}
                    </p>
                    <p>
                      <span className="font-medium">Điểm đến:</span>{" "}
                      {ticket.to_location}
                    </p>
                    <p>
                      <span className="font-medium">Mã chuyến đi:</span>{" "}
                      {ticket.trip_id}
                    </p>
                    <p>
                      <span className="font-medium">Họ và tên:</span>{" "}
                      {ticket.name}
                    </p>
                    <p>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {ticket.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {ticket.email}
                    </p>
                    <p>
                      <span className="font-medium">Số ghế:</span>{" "}
                      {ticket.seat_number}
                    </p>
                    <p>
                      <span className="font-medium">
                        Trạng thái thanh toán:
                      </span>{" "}
                      <span className="text-red-600">{ticket.status}</span>
                    </p>
                    <div className="text-sm font-medium flex flex-col sm:flex-row gap-2">
                      Vui lòng thanh toán trong:
                      <span className="text-red-600 flex gap-2">
                        <CountdownTimer seatExpiresAt={expiresAtLocal || ""} />{" "}
                        (Nếu không thanh toán trong thời gian quy định vé sẽ
                        hủy)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nút quay lại */}
          <div className="text-center  mt-8 w-full flex flex-col items-center gap-2 text-xl">
            <PayPalButton
              amount={totalAmount}
              currency="USD"
              onSuccess={handlePayment}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
