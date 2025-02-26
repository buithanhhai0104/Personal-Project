import { ITrips } from "@/types/trips";
import TripItem from "./tripItem";

interface TripsItemsProps {
  newTrips: ITrips[];
}
const TripsItems: React.FC<TripsItemsProps> = ({ newTrips }) => {
  if (!Array.isArray(newTrips) || newTrips.length === 0) {
    return (
      <div className=" w-full flex justify-center items-center text-red-600 text-2xl">
        Không tìn thấy chuyến đi
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold">
        Kết quả: {newTrips.length} chuyến xe
      </p>
      {newTrips.map((item, index) => {
        return (
          <div className="flex w-full  rounded-xl" key={index}>
            <TripItem tripItem={item} />
          </div>
        );
      })}
    </div>
  );
};

export default TripsItems;
