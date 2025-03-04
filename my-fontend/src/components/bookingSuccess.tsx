import { useState } from "react";
import CountdownTimer from "./countdownTimer";
import PayPalButton from "./pay/PayPalButton";
import { handlePaymentSuccess } from "@/utils/paymentUtils";
import { apisendEmail } from "@/service/sendEmailService";
import { IBookTicket } from "@/types/bookTickets";
import { ITrips } from "@/types/trips";
import { ISendEmail } from "@/types/sendEmail";

interface IBookingSuccessProps {
  bookTicketsData: IBookTicket | null;
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
  const [paymentTimeExpires, setPaymentTimeExpires] = useState<boolean>(true);

  const handlePayment = async () => {
    if (bookTicketsData) {
      const result = await handlePaymentSuccess(bookTicketsData);
      if (result) {
        setSuccessfulPayment(true);
        const sendEmailForm: ISendEmail = {
          to: bookTicketsData.email,
          subject: "Mã thông tin đặt vé ",
          tickets: bookTicketsData,
        };
        await apisendEmail(sendEmailForm);
      }
    }
  };

  const expiresAtLocal = new Date(
    bookTicketsData?.expires_at + " UTC"
  ).toLocaleString();

  return (
    <div className="min-h-screen w-[90%] sm:w-[60%] flex items-center justify-center">
      {successfulPayment ? (
        <div className="w-full overflow-auto bg-white shadow-custom rounded-lg p-6">
          <h1 className="text-3xl font-bold text-green-600 text-center">
            Thanh toán thành công
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Dưới đây là thông tin các vé bạn đã đặt:
          </p>
          <div className="p-4 border border-gray-200 rounded-lg shadow-custom bg-gray-50">
            <p>
              <b>Mã vé:</b> {bookTicketsData?.ticket_id}
            </p>
            <p>
              <b>Họ và tên:</b> {bookTicketsData?.name}
            </p>
            <p>
              <b>Số ghế:</b> {bookTicketsData?.seat_numbers}
            </p>
            <p>
              <b>Trạng thái thanh toán:</b>{" "}
              <span className="text-green-600">Đã thanh toán</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-auto bg-white shadow-custom rounded-lg p-6">
          <h1 className="text-3xl font-bold text-green-600 text-center">
            Đặt Vé Thành Công!
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Dưới đây là thông tin các vé của bạn :
          </p>

          <div className="p-4 border border-gray-200 rounded-lg shadow-custom bg-gray-50">
            <p>
              <b>Mã vé:</b> {bookTicketsData?.ticket_id}
            </p>
            <p>
              <b>Điểm đi:</b> {bookTicketsData?.from_location}
            </p>
            <p>
              <b>Điểm đến:</b> {bookTicketsData?.to_location}
            </p>
            <p>
              <b>Họ và tên:</b> {bookTicketsData?.name}
            </p>
            <p>
              <b>Số điện thoại:</b> {bookTicketsData?.phone}
            </p>
            <p>
              <b>Email:</b> {bookTicketsData?.email}
            </p>
            <p>
              <b>Số ghế:</b> {bookTicketsData?.seat_numbers}
            </p>
            <p>
              <b>Trạng thái thanh toán:</b>{" "}
              <span className="text-red-600">
                {paymentTimeExpires
                  ? bookTicketsData?.status
                  : "Hết hạn do chưa thanh toán"}
              </span>
            </p>

            <div className="text-sm font-medium flex flex-col sm:flex-row gap-2">
              Vui lòng thanh toán trong:
              <span className="text-red-600 flex gap-2">
                <CountdownTimer
                  seatExpiresAt={expiresAtLocal || ""}
                  setPaymentTimeExpires={setPaymentTimeExpires}
                />
                (Nếu không thanh toán trong thời gian quy định vé sẽ hủy)
              </span>
            </div>
          </div>

          {paymentTimeExpires ? (
            <div className="text-center mt-8 w-full flex flex-col items-center gap-2 text-xl">
              <PayPalButton
                amount={totalAmount}
                currency="USD"
                onSuccess={handlePayment}
              />
            </div>
          ) : (
            <div className="w-full text-red-600 text-center text-lg mt-4 shadow-custom p-2 border-[1px] border-red-600">
              Vé của bạn đã hết hạn do chưa thanh toán trong thời gian quy định.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
