"use client";
import { getAllTrips } from "@/service/tripService";
import { ITrips } from "@/types/trips";
import Image from "next/image";
import { FaDotCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useTrips } from "@/context/tripsContext";
import { useRouter } from "next/navigation";
interface IPopularProps {
  tripsData: ITrips[];
}

const Popular: React.FC<IPopularProps> = ({ tripsData }) => {
  const router = useRouter();
  const { setTripsData } = useTrips();

  const popularItems = [
    { title: "Hồ Chí Minh", location: "Hồ Chí Minh" },
    { title: "Đà Lạt", location: "Đà Lạt" },
    { title: "Đà Nẵng", location: "Đà Nẵng" },
  ];

  const handleTripSearch = async (departure: string) => {
    try {
      const tripSearch = await getAllTrips();
      if (Array.isArray(tripSearch))
        setTripsData(
          tripSearch.filter((item) => item.from_location === departure)
        );
      router.push("/trips");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center overflow-auto   ">
      <h1 className="text-3xl text-center text-[#3b82f6] font-bold">
        TUYẾN PHỔ BIẾN
      </h1>
      <p className="text-center text-[#3b82f6]">
        Được khách hàng tin tưởng và lựa chọn
      </p>
      <div className=" w-[90%] flex  flex-col overflow-x-scroll md:overflow-hidden ">
        <div className="flex gap-8 p-3  ">
          {popularItems.map((item, index) => {
            const filteredTrips = tripsData.filter(
              (trip) => trip.from_location === item.location
            );
            console.log(filteredTrips);
            return (
              <div
                onClick={() => handleTripSearch(item.title)}
                className=" w-full bg-white rounded-xl mt-5 shadow-custom cursor-pointer"
                key={item.title}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    className="shadow-custom rounded-xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                    width={500}
                    height={140}
                    src={`/images/popular-image${index + 1}.png`}
                    alt={item.title}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute top-[50%] left-4">
                    <p>Tuyến xe từ</p>
                    <h4 className="text-2xl font-bold">{item.title}</h4>
                  </div>
                </div>
                {filteredTrips.slice(0, 3).map((data, dataIndex) => (
                  <div
                    className="flex flex-col p-4 text-black border-b-2"
                    key={dataIndex}
                  >
                    <div className="flex flex-col">
                      <span className="text-[#00613D] font-semibold">
                        <div className="flex flex-1 justify-center items-center text-lg">
                          {data.start_time.slice(0, -3)}
                          <FaDotCircle className="m-3 text-[#3b82f6]" />
                          <div className="flex-1 h-[1px] w-6 bg-gray-300 rounded-full" />
                          <div className="text-[12px] text-center text-gray-500">
                            {data.travel_time} <br />
                            (Asian/Ho Chi Minh)
                          </div>
                          <div className="flex-1 h-[1px] w-6 bg-gray-300 rounded-full" />
                          <FaMapMarkerAlt className="m-3 text-red-600" />
                          {data.arrival_time.slice(0, -3)}
                        </div>
                      </span>
                      <div className="flex justify-between">
                        <p className="text-sm">{data.from_location}</p>
                        <p className="text-sm">{data.to_location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Popular;
