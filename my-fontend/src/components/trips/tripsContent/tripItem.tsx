"use client";

import { FaDotCircle, FaMapMarkerAlt } from "react-icons/fa";
import { ITrips } from "@/types/trips";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useUser } from "@/context/authContext";

interface TripsItemProps {
  tripItem: ITrips;
}

const TripItem: React.FC<TripsItemProps> = ({ tripItem }) => {
  const { user } = useUser();
  const router = useRouter();

  // Xử lý đặt chuyến
  const handleBookTrip = () => {
    if (user) {
      router.push(`/trips/${tripItem.id}`);
    } else {
      alert("Vui lòng đăng nhập để đặt chuyến xe");
      router.push("/auth");
    }
  };

  // Kiểm tra seats trước khi filter
  const emptySeats = useMemo(() => {
    if (!Array.isArray(tripItem.seats)) return [];
    return tripItem.seats.filter((seat) => seat.status === "available");
  }, [tripItem.seats]);

  // Format thời gian
  const formatTime = (time?: string) =>
    time?.slice(0, -3) || "Không có thông tin";

  // Format tiền tệ
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="border-2 border-[#3b82f6] rounded-xl shadow-custom p-4 w-full max-w-sm sm:max-w-4xl mx-auto bg-white">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-between items-center">
        {/* Thông tin thời gian và bến */}
        <div className="flex flex-col  flex-1 text-center sm:text-left">
          {/* Giờ khởi hành */}
          <div className="flex flex-col  sm:flex-row items-center sm:justify-between">
            <div className="text-black text-lg sm:text-2xl font-bold">
              {formatTime(tripItem.start_time)}
            </div>
            <div className="flex flex-1 items-center">
              <FaDotCircle className="mx-2 sm:m-3 text-[#3b82f6]" />
              <div className="hidden sm:block flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
              <div className="flex text-center text-sm text-gray-500">
                {tripItem.travel_time || "Không xác định"} <br /> (Asia/Ho Chi
                Minh)
              </div>
              <div className="hidden sm:block flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
              <FaMapMarkerAlt className="mx-2 sm:m-3 text-red-600" />
            </div>
            {/* Giờ đến nơi */}
            <div className="text-black text-lg sm:text-2xl font-bold">
              {formatTime(tripItem.arrival_time)}
            </div>
          </div>
          {/* Tên bến */}
          <div className="flex justify-between text-gray-700 text-sm sm:text-base mt-2">
            <div>{tripItem.from_location || "Không xác định"}</div>
            <div>{tripItem.to_location || "Không xác định"}</div>
          </div>
        </div>

        {/* Thông tin ghế trống và giá */}
        <div className="text-center sm:text-right">
          <div className="text-xs sm:text-sm text-gray-500">
            {tripItem.bus_type || "Không xác định"} &bull;{" "}
            <span className="text-green-500">
              {emptySeats.length > 0
                ? `${emptySeats.length} chỗ trống`
                : "Hết ghế"}
            </span>
          </div>
          <div className="text-orange-500 text-lg sm:text-xl font-bold">
            {formatCurrency(tripItem.price)}
          </div>
        </div>
      </div>

      {/* Nút chọn chuyến */}
      <div className="mt-6 flex sm:flex-row justify-end items-center">
        <button
          onClick={handleBookTrip}
          disabled={emptySeats.length === 0}
          className={`px-4 sm:px-6 py-2 mt-4 sm:mt-0 rounded-lg transition ${
            emptySeats.length > 0
              ? "bg-[#3b82f6] text-white hover:bg-[#2e64bb]"
              : "bg-gray-400 text-gray-300 cursor-not-allowed"
          }`}
        >
          {emptySeats.length > 0 ? "Chọn chuyến" : "Hết chỗ"}
        </button>
      </div>
    </div>
  );
};

export default TripItem;
