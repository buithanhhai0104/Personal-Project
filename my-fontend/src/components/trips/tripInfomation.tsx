"use client";
import { ITrips } from "@/types/trips";
import { useEffect, useState } from "react";

interface ITripInfomationProps {
  trip: ITrips;
  selectedSeats: string[];
}

const TripInfomation: React.FC<ITripInfomationProps> = ({
  trip,
  selectedSeats,
}) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (trip && selectedSeats.length > 0) {
      const totalAmount = selectedSeats.length * trip.price;
      setTotal(totalAmount);
    }
    if (selectedSeats.length === 0) {
      setTotal(0);
    }
  }, [trip, selectedSeats]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formattedDate = new Date(trip.departure_time).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
  return (
    <div className=" bg-white rounded-lg shadow-custom p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Thông tin chuyến xe
        </h2>
      </div>

      {/* Trip Info */}
      <div className="space-y-4">
        {/* Tuyến xe */}
        <div className="flex justify-between text-gray-600 text-sm">
          <span className="font-medium">Tuyến xe</span>
          <span className="font-bold text-base">
            {trip.from_location} - {trip.to_location}
          </span>
        </div>

        {/* Route */}
        <div className="flex justify-between text-gray-600 text-sm">
          <span className="font-medium">Kiểu xe</span>
          <span className="font-medium">{trip.bus_type}</span>
        </div>

        {/* Ngày đi */}
        <div className="flex justify-between text-gray-600 text-sm">
          <span className="font-medium">Thời gian xuất bến</span>
          <span className="font-medium">
            {trip.start_time.slice(0, -3)} {formattedDate}
          </span>
        </div>

        {/* Số lượng ghê */}
        <div className="flex justify-between text-gray-600 text-sm">
          <span className="font-medium">Số lượng ghế</span>
          <span className="font-medium">{selectedSeats.length} Ghế</span>
        </div>

        {/* Mã số ghế */}
        <div className="flex  justify-between text-gray-600 text-sm">
          <span className="font-medium">Số ghế</span>

          <span className=" flex gap-2 font-medium">
            {selectedSeats.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </span>
        </div>
        {/* Tổng Tiền */}
        <div className="flex justify-between text-gray-600 text-sm">
          <span className="font-medium">Tổng tiền lược đi</span>
          <span className="font-bold text-red-600 text-xl">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripInfomation;
