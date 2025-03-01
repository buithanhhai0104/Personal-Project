"use client";
import SearchBox from "@/components/searchBox";
import TripFilter from "@/components/trips/tripFilter";
import TripsItems from "@/components/trips/tripsContent/tripsItems";
import { useTrips } from "@/context/tripsContext";
import { ITrips } from "@/types/trips";
import { useEffect, useState } from "react";

export default function Trips() {
  const { tripsData } = useTrips();
  const [newTrips, setNewTrips] = useState<ITrips[]>([]);

  useEffect(() => {
    if (Array.isArray(tripsData)) {
      setNewTrips(tripsData);
    } else {
      setNewTrips([]);
    }
  }, [tripsData]);
  console.log(tripsData);
  return (
    <div className="flex flex-col mt-24 mb-10 w-full max-w-[1200px] mx-auto">
      <SearchBox />
      <div className="grid grid-cols-1 md:grid-cols-7 gap-7 text-black mt-12">
        <aside className="md:col-span-2 w-full">
          <TripFilter setNewTrips={setNewTrips} newTrips={newTrips} />
        </aside>
        <div className="md:col-span-5 w-full">
          <TripsItems newTrips={newTrips} />
        </div>
      </div>
    </div>
  );
}
