"use client";
import { IBookTicket } from "@/types/bookTickets";
import React, { useState } from "react";
import PayPalButton from "./pay/PayPalButton";
import CountdownTimer from "./countdownTimer";
import { handlePaymentSuccess } from "@/utils/paymentUtils";
import { ITrips } from "@/types/trips";
import moment from "moment-timezone";

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
    const result = await handlePaymentSuccess(bookTicketsData);
    if (result) {
      setSuccessfulPayment(true);
    }
    console.log(result, details);
  };

  const convertToTimezone = (dateString: string) => {
    return moment(dateString).tz("Asia/Ho_Chi_Minh").format();
  };

  return (
    <div className="min-h-screen w-[90%] sm:w-[60%] flex items-center justify-center">
      {successfulPayment ? (
        /* UI khi thanh toán thành công */
        <div>...</div>
      ) : (
        <div className="w-full overflow-auto bg-white shadow-custom rounded-lg p-6">
          {/* Danh sách vé */}
          <div className="flex flex-col gap-3">
            {bookTicketsData?.map((ticket, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-custom bg-gray-50"
              >
                <p>Mã vé: {ticket.ticket_id}</p>
                {/* Các thông tin khác */}
                <div>
                  Vui lòng thanh toán trong:
                  <span className="text-red-600">
                    <CountdownTimer
                      seatExpiresAt={convertToTimezone(ticket.expires_at)}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <PayPalButton
            amount={totalAmount}
            currency="USD"
            onSuccess={handlePayment}
          />
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
