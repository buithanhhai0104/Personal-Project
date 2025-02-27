"use client";
import { getAllTrips, apiTripsSearch } from "@/service/tripService";
import { useEffect, useState } from "react";
import { useTrips } from "@/context/tripsContext";
import { useRouter } from "next/navigation";
import { ITrips } from "@/types/trips";
interface IParams {
  from_location: string;
  to_location: string;
  departure_date: string;
}
const SearchBox: React.FC = () => {
  const router = useRouter();
  const [departure, setDeparture] = useState<string>("Chọn điểm đi");
  const [destination, setDestination] = useState<string>("");
  const [travelDate, setTravelDate] = useState<string>("");
  const [numTickets, setNumTickets] = useState<number>(1);
  const [formLocationList, setFormLocationList] = useState<ITrips[]>([]);
  const [toLocationList, setToLocationList] = useState<ITrips[]>([]);

  const { setTripsData } = useTrips();

  const handleTripSearch = async () => {
    if (departure === "Chọn điểm đi") {
      alert("Vui lòng chọn điểm đi");
      return;
    }
    if (!travelDate) {
      alert("Vui lòng chọn ngày đi.");
      return;
    }
    const params: IParams = {
      from_location: departure,
      to_location: destination,
      departure_date: travelDate,
    };

    try {
      const tripSearch = await apiTripsSearch(params);
      if (tripSearch && tripSearch.length > 0) {
        setTripsData(tripSearch);
        router.push("/trips");
      } else {
        alert("Không tìm thấy chuyến xe phù hợp.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      const seenFrom = new Set();
      const seenTo = new Set();
      try {
        const res = await getAllTrips();
        if (res.length > 0) {
          const formLocation = res.filter((item: ITrips) => {
            if (seenFrom.has(item.from_location)) {
              return false;
            }
            seenFrom.add(item.from_location);
            return true;
          });

          const toLocation = res.filter((item: ITrips) => {
            if (seenTo.has(item.to_location)) {
              return false;
            }
            seenTo.add(item.to_location);
            return true;
          });
          setFormLocationList(formLocation);
          setToLocationList(toLocation);
        }
      } catch (err) {
        console.log("Lấy danh sách :", err);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className=" relative  p-6 border-[2px] border-[#3b82f6] rounded-2xl shadow-custom bg-white text-sm lg:text-[16px]">
      <div className="flex justify-between mb-6">
        <div>
          <span className="text-[#3b82f6] text-sm">Tìm kiếm vé xe</span>
        </div>
      </div>
      <div className="flex flex-col gap-8 justify-between pb-10 sm:flex-row">
        <div className="w-full flex gap-5">
          <div className="w-full">
            <label
              htmlFor="departure"
              className="block text-[16px] font-medium text-gray-700"
            >
              Điểm đi
            </label>
            <select
              onChange={(e) => setDeparture(e.target.value)}
              value={departure}
              className="mt-1 block w-full px-4 py-2 border-[1px] border-[#3b82f6]  rounded-md text-black shadow-sm "
              name="from_location"
            >
              <option>Chọn điểm đi</option>
              {formLocationList?.map((item, index) => {
                return (
                  <option key={index} value={item.from_location}>
                    {item.from_location}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-full">
            <label
              htmlFor="destination"
              className="block text-[16px] font-medium text-gray-700"
            >
              Điểm đến
            </label>
            <select
              onChange={(e) => setDestination(e.target.value)}
              value={destination}
              className="mt-1 block w-full px-4 py-2 border-[1px] border-[#3b82f6] rounded-md text-black shadow-sm "
              name="from_location"
            >
              <option>Chọn điểm đến</option>
              {toLocationList?.map((item, index) => {
                return (
                  <option key={index} value={item.to_location}>
                    {item.to_location}
                  </option>
                );
              })}
            </select>
            ;
          </div>
        </div>

        <div className="flex w-full gap-5">
          <div className="w-full">
            <label
              htmlFor="travelDate"
              className="block text-[16px] font-medium text-gray-700"
            >
              Ngày đi
            </label>
            <input
              type="date"
              id="travelDate"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-[1px] border-[#3b82f6] rounded-md text-black shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="numTickets"
              className="block text-[16px] font-medium text-gray-700"
            >
              Số vé
            </label>
            <input
              type="number"
              id="numTickets"
              value={numTickets}
              onChange={(e) => setNumTickets(parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-4 py-2 border-[1px] border-[#3b82f6] rounded-md text-black shadow-sm focus:ring-orange-500 focus:border-orange-500"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

      <div className=" flex justify-center">
        <button
          onClick={handleTripSearch}
          className=" mb-[-50px] w-96 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2e65bd] transition"
        >
          Tìm chuyến xe
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
