"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ITrips } from "@/types/trips";
import { BsCalendarRange } from "react-icons/bs";
import { useTrips } from "@/context/tripsContext";

interface ITripFilterProps {
  newTrips: ITrips[];
  setNewTrips: Dispatch<SetStateAction<ITrips[]>>;
}

const TripFilter: React.FC<ITripFilterProps> = ({ setNewTrips, newTrips }) => {
  const [activeArrange, setActiveArrange] = useState<string>("Mặc định");
  const [activeVehicleType, SetActiveVehicleType] = useState<string>("Tất cả");
  const { tripsData } = useTrips();
  const [originalTrips, setOriginalTrips] = useState<ITrips[]>([]);

  useEffect(() => {
    if (tripsData) {
      setOriginalTrips(tripsData);
      setNewTrips(tripsData);
    }
  }, [tripsData, setNewTrips]);

  const arrange = ["Mặc định", "Giá tăng dần", "Giá giảm dần"];
  const vehicleType = ["Tất cả", "Ghế", "Giường", "Limousine"];

  const handleActiveArrange = (item: string) => {
    if (!newTrips || !originalTrips) {
      alert("Không có chuyến xe để tìm kiếm");
      return;
    }

    switch (item) {
      case "Giá giảm dần":
        setNewTrips([...newTrips].sort((a, b) => b.price - a.price));
        break;
      case "Giá tăng dần":
        setNewTrips([...newTrips].sort((a, b) => a.price - b.price));
        break;
      case "Mặc định":
        setNewTrips(originalTrips);
        break;
      default:
        console.log("Unknown sort type");
    }

    setActiveArrange(item);
  };

  const handleActiveVehicleType = (item: string) => {
    SetActiveVehicleType(item);

    if (!originalTrips) {
      alert("Không có chuyến xe để tìm kiếm");
      return;
    }

    if (item === "Tất cả") {
      setNewTrips(originalTrips);
      return;
    }

    setNewTrips(originalTrips.filter((trip) => trip.bus_type === item));
  };

  return (
    <div className="flex flex-col sticky top-16 bg-white shadow-custom p-3 w-full rounded-xl">
      {/* Sắp xếp */}
      <div className="border-b-[1px] border-black pb-2">
        <h3 className="text-lg font-bold">Sắp xếp</h3>
        <ul className="flex flex-col md:flex-col md:gap-4 py-2">
          {arrange.map((item, index) => (
            <li
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                activeArrange === item
                  ? "text-orange-600 font-semibold"
                  : "hover:text-orange-500"
              }`}
              key={index}
              onClick={() => handleActiveArrange(item)}
            >
              <BsCalendarRange />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lọc loại xe */}
      <div>
        <h3 className="text-lg font-bold my-2">Loại xe</h3>
        <ul className="flex flex-wrap gap-2 sm:gap-3 md:flex-row md:gap-4">
          {vehicleType.map((item, index) => (
            <li
              className={`flex items-center px-3 py-1 border cursor-pointer transition-all rounded-lg text-sm md:text-base ${
                activeVehicleType === item
                  ? "border-orange-600 text-orange-600 font-semibold"
                  : "border-gray-300 hover:border-orange-500 hover:text-orange-500"
              }`}
              key={index}
              onClick={() => handleActiveVehicleType(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TripFilter;
