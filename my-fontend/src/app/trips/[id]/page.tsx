"use client";

import React, { useEffect, useState } from "react";
import { getTripById } from "@/service/tripService";
import { ITrips } from "@/types/trips";
import Seats from "@/components/seat/seats";
import TripInfomation from "@/components/trips/tripInfomation";
import { useUser } from "@/context/authContext";
import { bookTickets } from "@/service/ticketsService";
import { IBookTicket } from "@/types/bookTickets";
import BookingSuccess from "@/components/bookingSuccess";
import LoadingSpinner from "@/components/loadingSpinner";

const TripPage = ({ params }: { params: Promise<{ id: number }> }) => {
  const [trip, setTrip] = useState<ITrips | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookTicketsData, setBookTicketData] = useState<IBookTicket | null>(
    null
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookTicketName, setBookTicketName] = useState<string>("");
  const [bookTicketPhone, setBookTicketPhone] = useState<string>("");
  const [bookTicketEmail, setBookTicketEmail] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  // Lấy user từ context
  const { user } = useUser();
  const resolvedParams = React.use(params);
  const { id } = resolvedParams || {};

  useEffect(() => {
    const fetchTripById = async () => {
      setLoading(true);
      try {
        const res = await getTripById(id);
        if (res) {
          setTrip(res);
        } else {
          setTrip(null);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu", err);
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTripById();
  }, [id, bookingSuccess]);

  const handleSelectedSeats = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const validateFields = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};

    if (!bookTicketName.trim()) newErrors.name = "Vui lòng nhập họ và tên!";
    if (!bookTicketPhone.match(/^\d{10}$/))
      newErrors.phone = "Số điện thoại phải có 10 chữ số!";
    if (!bookTicketEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = "Email không hợp lệ!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookTicket = async () => {
    if (!validateFields()) return;

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
    console.log(selectedSeats);
    try {
      const bookTicket = await bookTickets(ticketData);
      console.log(bookTicket);
      setBookTicketData(bookTicket.ticket);
      setBookingSuccess(true);
      setBookTicketEmail("");
      setBookTicketPhone("");
      setBookTicketName("");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!trip) {
    return (
      <div className="text-center text-red-500">Không tìm thấy chuyến đi!</div>
    );
  }

  return bookingSuccess ? (
    <div className="flex flex-col mt-20 mb-10 text-black">
      <div className="flex flex-col items-center">
        <BookingSuccess
          bookTicketsData={bookTicketsData}
          selectedSeats={selectedSeats}
          detailTrip={trip}
        />
      </div>
    </div>
  ) : (
    <div className="w-[95%] sm:w-[70%] m-auto mt-20 mb-10 pt-5 flex flex-col md:flex-row gap-6">
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
          <InputField
            label="Họ và tên *"
            value={bookTicketName}
            onChange={setBookTicketName}
            type="text"
            error={errors.name}
          />
          <InputField
            label="Số điện thoại *"
            value={bookTicketPhone}
            onChange={setBookTicketPhone}
            type="tel"
            error={errors.phone}
          />
          <InputField
            label="Email *"
            value={bookTicketEmail}
            onChange={setBookTicketEmail}
            type="email"
            error={errors.email}
          />
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
            (*) Quý khách vui lòng có mặt tại bến xuất phát trước ít nhất 30
            phút.
          </p>
          <p>
            (*) Nếu cần trung chuyển, vui lòng liên hệ Tổng đài 1900 **** trước
            khi đặt vé.
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ Component đung để tái sử dụng
const InputField = ({
  label,
  value,
  onChange,
  type,
  error,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type: string;
  error?: string;
}) => (
  <div>
    <label className="block text-gray-600 text-sm font-medium">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      required
      className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}{" "}
  </div>
);

export default TripPage;
