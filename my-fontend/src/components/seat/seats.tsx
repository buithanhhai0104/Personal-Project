import { ISeats } from "@/types/trips";
import React, { useEffect, useState } from "react";

interface ISeatsProps {
  seats: ISeats[];
  onSeatsChange: (seats: string[]) => void;
}

const Seats: React.FC<ISeatsProps> = ({ seats, onSeatsChange }) => {
  const [upstairs, setUptairs] = useState<ISeats[]>([]);
  const [downstairs, setDowntairs] = useState<ISeats[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  useEffect(() => {
    if (seats) {
      const upstairsFilter = seats.filter(
        (item) => item.seat_number.slice(0, 1) === "B"
      );
      setUptairs(upstairsFilter);

      const downstairsFilter = seats.filter(
        (item) => item.seat_number.slice(0, 1) === "A"
      );
      setDowntairs(downstairsFilter);
    }
  }, [seats]);

  useEffect(() => {
    onSeatsChange(selectedSeats);
  }, [selectedSeats, onSeatsChange]);

  const handleSelectSeat = (seatNumber: string, seatStatus: string) => {
    if (seatStatus === "booked") {
      return;
    }

    if (selectedSeats.length >= 5 && !selectedSeats.includes(seatNumber)) {
      alert("Bạn chỉ có thể chọn tối đa 5 ghế cùng lúc.");
      return;
    }

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter((seat) => seat !== seatNumber);
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  return (
    <div className=" flex flex-col bg-white shadow-custom p-4 text-black rounded-xl">
      <p className="text-xl font-semibold">Chọn ghế</p>
      <div className="flex gap-3">
        <div className="flex gap-10">
          <div className="flex flex-col items-center">
            <p className="p-3">Tầng dưới</p>
            <div className="grid grid-cols-3 gap-3">
              {downstairs.map((seat, index) => {
                return (
                  <span
                    className={`flex justify-center items-center p-2 text-sm ${
                      seat.status === "available"
                        ? selectedSeats.includes(seat.seat_number)
                          ? "bg-orange-300"
                          : "bg-blue-300"
                        : "bg-[#ccc]"
                    } cursor-pointer rounded-xl`}
                    key={index}
                    onClick={() =>
                      handleSelectSeat(seat.seat_number, seat.status)
                    }
                  >
                    {seat.seat_number}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="p-3">Tầng trên</p>
            <div className="grid grid-cols-3 gap-3">
              {upstairs.map((seat, index) => {
                return (
                  <span
                    className={`flex justify-center items-center text-sm p-2 ${
                      seat.status === "available"
                        ? selectedSeats.includes(seat.seat_number)
                          ? "bg-orange-300"
                          : "bg-blue-300"
                        : "bg-[#ccc]"
                    } cursor-pointer rounded-xl`}
                    key={index}
                    onClick={() =>
                      handleSelectSeat(seat.seat_number, seat.status)
                    }
                  >
                    {seat.seat_number}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-5 justify-center items-center text-sm">
            <span className=" flex justify-center items-center p-2 bg-[#ccc] cursor-pointer rounded-xl">
              Đã bán
            </span>
            <span className=" flex justify-center items-center p-2 bg-blue-300 cursor-pointer rounded-xl">
              Còn ghế
            </span>
            <span className=" flex justify-center items-center p-2 bg-orange-300 cursor-pointer rounded-xl">
              chọn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seats;
