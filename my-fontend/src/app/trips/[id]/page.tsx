"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getTripById } from "@/service/tripService";
import { ITrips } from "@/types/trips";
import Seats from "@/components/seat/seats";
import TripInfomation from "@/components/trips/tripInfomation";
import { useUser } from "@/context/authContext";
import { bookTickets } from "@/service/ticketsService";
import { IBookTicket } from "@/types/bookTickets";
import BookingSuccess from "@/components/bookingSuccess";

const TripPage = ({ params }: { params: Promise<{ id: number }> }) => {
  const [trip, setTrip] = useState<ITrips | null>(null);
  const [bookTicketsData, setBookTicketData] = useState<IBookTicket[] | null>(
    null
  );
  // dữ liệu người dùng nhập để book
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookTicketName, setBookTicketName] = useState<string>("");
  const [bookTicketPhone, setBookTicketPhone] = useState<string>("");
  const [bookTicketEmail, setBookTicketEmail] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // lấy user từ context
  const { user } = useUser();

  const resolvedParams = React.use(params);
  const { id } = resolvedParams || {};
  useEffect(() => {
    const fetchTripById = async () => {
      try {
        const res = await getTripById(id);
        setTrip(res);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu", err);
      }
    };

    fetchTripById();
  }, [id, bookingSuccess]);

  const handleSelectedSeats = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  // hàm dùng để book ticket
  const handleBookTicket = async () => {
    if (
      !user ||
      bookTicketName === "" ||
      bookTicketPhone === "" ||
      bookTicketEmail === "" ||
      selectedSeats.length === 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin đặt vé");
      return;
    }
    const ticketData = {
      user_id: user?.id,
      trip_id: id,
      from_location: trip?.from_location,
      to_location: trip?.to_location,
      seat_numbers: selectedSeats,
      name: bookTicketName,
      phone: bookTicketPhone,
      email: bookTicketEmail,
    };
    try {
      const bookTicket = await bookTickets(ticketData);
      setBookTicketData(bookTicket.tickets);
      setBookingSuccess(true);
      setBookTicketEmail("");
      setBookTicketPhone("");
      setBookTicketName("");
    } catch (err) {
      console.log(err);
    }
  };

  if (!trip) {
    return <div>Không tìm thấy chuyến đi!</div>;
  }

  return bookingSuccess ? (
    <div className=" flex flex-col mt-16 mb-10 text-black">
      <div className=" flex flex-col items-center">
        <BookingSuccess
          bookTicketsData={bookTicketsData}
          selectedSeats={selectedSeats}
          detailTrip={trip}
        />
      </div>
    </div>
  ) : (
    <div className="w-[95%] sm:w-[70%] m-auto mt-16 mb-10 pt-5 flex flex-col md:flex-row gap-6">
      {/* Phần danh sách ghế và thông tin chuyến đi */}
      <div className="flex-1 flex flex-col gap-4">
        <Seats seats={trip.seats} onSeatsChange={handleSelectedSeats} />
        <TripInfomation trip={trip} selectedSeats={selectedSeats} />
      </div>

      {/* Sidebar Thông tin khách hàng */}
      <div className="w-full flex-1 md:w-[30%] sticky top-16 p-6 bg-white rounded-lg shadow-custom">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Thông tin khách hàng
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 text-sm font-medium"
            >
              Họ và tên *
            </label>
            <input
              value={bookTicketName}
              onChange={(e) => setBookTicketName(e.target.value)}
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-gray-600 text-sm font-medium"
            >
              Số điện thoại *
            </label>
            <input
              value={bookTicketPhone}
              onChange={(e) => setBookTicketPhone(e.target.value)}
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-medium"
            >
              Email *
            </label>
            <input
              value={bookTicketEmail}
              onChange={(e) => setBookTicketEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Chấp nhận điều khoản đặt vé & chính sách bảo mật thông tin của
              chúng tôi
            </label>
          </div>
          <button
            onClick={handleBookTicket}
            className="w-full py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Đặt vé
          </button>
        </div>
        <div className="mt-6 text-gray-600 text-sm">
          <p className="text-red-500 font-semibold">Điều khoản & lưu ý</p>
          <p>
            (*) Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít nhất
            30 phút giờ xe khởi hành, mang theo thông báo đã thanh toán.
          </p>
          <p>
            (*) Nếu quý khách có nhu cầu trung chuyển, vui lòng liên hệ Tổng đài
            trung chuyển 1900 **** trước khi đặt vé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripPage;
