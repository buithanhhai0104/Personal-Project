"use client";

import { FaDotCircle } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
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
  const handleBookTrip = () => {
    if (user) {
      router.push(`/trips/${tripItem.id}`);
    } else {
      alert("Vui lòng đăng nhập để đặt chuyến xe");
      router.push("/auth");
    }
  };

  const emptySeats = useMemo(() => {
    return tripItem.seats.filter((item) => item.status === "available");
  }, [tripItem.seats]);

  const formatTime = (time: string) => {
    return time ? time.slice(0, -3) : "Không có thông tin";
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="border-2 border-orange-300 rounded-xl shadow-custom p-4 w-full max-w-sm sm:max-w-4xl mx-auto bg-white">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-between items-center">
        {/* Thông tin thời gian và bến */}
        <div className="flex flex-col flex-1 text-center sm:text-left">
          {/* Giờ khởi hành */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between">
            <div className="text-black text-lg sm:text-2xl font-bold">
              {formatTime(tripItem.start_time)}
            </div>
            <div className="flex flex-1 items-center">
              <FaDotCircle className="mx-2 sm:m-3" />
              <div className="hidden sm:block flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
              <div className=" flex text-center text-sm text-gray-500">
                {tripItem.travel_time} <br />
                (Asian/Ho Chi Minh)
              </div>
              <div className="hidden sm:block flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
              <FaMapMarkerAlt className="mx-2 sm:m-3" />
            </div>
            {/* Giờ đến nơi */}
            <div className="text-black text-lg sm:text-2xl font-bold">
              {formatTime(tripItem.arrival_time)}
            </div>
          </div>
          {/* Tên bến */}
          <div className="flex justify-between text-gray-700 text-sm sm:text-base mt-2">
            <div>{tripItem.from_location}</div>
            <div>{tripItem.to_location}</div>
          </div>
        </div>

        {/* Thông tin ghế trống và giá */}
        <div className="text-center sm:text-right">
          <div className="text-xs sm:text-sm text-gray-500">
            {tripItem.bus_type} &bull;{" "}
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
      <div className="mt-6 flex  sm:flex-row justify-end items-center">
        <button
          onClick={handleBookTrip}
          className="bg-orange-500 text-white px-4 sm:px-6 py-2 mt-4 sm:mt-0 rounded-lg hover:bg-orange-600 transition"
        >
          Chọn chuyến
        </button>
      </div>
    </div>
  );
};

export default TripItem;
