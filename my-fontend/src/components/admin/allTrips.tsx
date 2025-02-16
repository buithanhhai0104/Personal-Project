"use client";
import { getTickets } from "@/service/ticketsService";
import { deleteTrip, getAllTrips, UpdateTripbyId } from "@/service/tripService";
import { ITrips } from "@/types/trips";
import React, { useEffect, useState } from "react";
import { FaDotCircle, FaMapMarkerAlt } from "react-icons/fa";

const AllTrips = () => {
  const [trips, setTrips] = useState<ITrips[] | null>(null);
  const [tripsFillter, setTripsFillter] = useState<ITrips[] | null>(null);
  const [activeArrange, setActiveArrange] = useState<string>("Mặc định");
  const [activeLocation, setActiveLocation] = useState<string>("Tất cả");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTrip, setCurrentTrip] = useState<ITrips | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllTrips = async () => {
    setLoading(true);
    try {
      const res = await getAllTrips();
      const resp = await getTickets();
      if (res) {
        setTrips(res);
        setTripsFillter(res);
      }
      console.log(resp);
    } catch (err) {
      console.error("Lỗi lấy tất cả chuyến đi:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllTrips();
  }, []);

  const handleActiveArrange = (item: string) => {
    if (!tripsFillter || !trips) {
      alert("Không có chuyến xe để tìm kiếm");
      return;
    }
    switch (item) {
      case "Chuyến xe sớm nhất":
        setTripsFillter(
          [...tripsFillter].sort(
            (a, b) =>
              new Date(b.departure_time).getTime() -
              new Date(a.departure_time).getTime()
          )
        );
        break;
      case "Chuyến xe muộn nhất":
        setTripsFillter(
          [...tripsFillter].sort(
            (a, b) =>
              new Date(a.departure_time).getTime() -
              new Date(b.departure_time).getTime()
          )
        );
        break;
      case "Giá tăng dần":
        setTripsFillter([...tripsFillter].sort((a, b) => b.price - a.price));
        break;
      case "Tất cả":
        setTripsFillter(trips);
        break;
      default:
        console.log("Unknown sort type");
    }

    setActiveArrange(item);
  };

  const handleFilterLocation = (item: string) => {
    if (!tripsFillter || !trips) {
      alert("Không có chuyến xe để tìm kiếm");
      return;
    }

    switch (item) {
      case item:
        if (item === "Tất cả") {
          setTripsFillter(trips);
        } else {
          setTripsFillter(trips.filter((e) => e.from_location === item));
        }

        break;

      default:
        console.log("Unknown sort type");
    }
    setActiveLocation(item);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleEdit = (trip: ITrips) => {
    setEditMode(true);
    setCurrentTrip(trip);
  };

  const handleSave = async (id: number) => {
    try {
      const res = await UpdateTripbyId(id, currentTrip);

      if (res) {
        fetchAllTrips();
      }
    } catch (err) {
      console.log("Lỗi sửa chuyến đi", err);
    }

    setEditMode(false);
  };
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTrip(id);
      if (res) {
        fetchAllTrips();
      }
    } catch (err) {
      console.log("Lỗi xóa chuyến đi", err);
    }
    setEditMode(false);
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex flex-col flex-1  px-5 py-10 bg-gray-100 min-h-screen">
      <div className="flex  flex-col  gap-10 justify-between mb-4">
        <h2 className="text-3xl font-semibold text-blue-800">
          Danh sách chuyến đi
        </h2>
        <div className="flex gap-4 items-center">
          <select
            id="form_location"
            name="form_location"
            value={activeLocation}
            onChange={(e) => handleFilterLocation(e.target.value)}
            className={`px-4 py-2 rounded-full text-black  border-[3px] border-blue-500 `}
            required
          >
            <option value="Tất cả">Tất cả</option>
            {trips
              ?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex((t) => t.from_location === item.from_location)
              )
              .map((item, index) => {
                return (
                  <option key={index} value={item.from_location}>
                    {item.from_location}
                  </option>
                );
              })}
          </select>
          <button
            onClick={() => handleActiveArrange("Chuyến xe sớm nhất")}
            className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors ${
              activeArrange === "Chuyến xe sớm nhất" && "bg-blue-700"
            }`}
          >
            Chuyến xe sớm nhất
          </button>
          <button
            onClick={() => handleActiveArrange("Chuyến xe muộn nhất")}
            className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors ${
              activeArrange === "Chuyến xe muộn nhất" && "bg-blue-700"
            }`}
          >
            Chuyến xe muộn nhất
          </button>
          <button
            onClick={() => handleActiveArrange("Giá tăng dần")}
            className={`px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors ${
              activeArrange === "Giá tăng dần" && "bg-blue-700"
            }`}
          >
            Giá giảm dần
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {tripsFillter?.map((trip, index) => {
          const formattedDate = new Date(
            trip.departure_time
          ).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          const reservedSeats = Array.isArray(trip?.seats)
            ? trip.seats.filter((seat) => seat.status === "booked")
            : [];
          console.log(reservedSeats);
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow transform overflow-hidden"
            >
              <div className="p-5 flex items-center justify-between gap-4">
                {/* Thời gian và giá vé */}
                <div className="flex flex-col text-black">
                  <span className="text-[#00613D] font-semibold ">
                    <div className="flex flex-1 justify-center items-center">
                      {trip.start_time.slice(0, -3)}
                      <FaDotCircle className="m-3" />
                      <div className=" flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
                      <div className="text-[12px] text-center text-gray-500">
                        {trip.travel_time} <br />
                        (Asian/Ho Chi Minh)
                      </div>
                      <div className=" flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
                      <FaMapMarkerAlt className="m-3" />
                      {trip.arrival_time.slice(0, -3)}
                    </div>
                  </span>
                  <div className="flex justify-between">
                    <p className="text-sm">{trip.from_location}</p>
                    <p className="text-sm">{trip.to_location}</p>
                  </div>
                </div>
                <div className="flex gap-1 items-start text-gray-600">
                  <span> Mã số xe:</span>
                  {trip.id}
                </div>
                {/* Ngày khởi hành */}
                <div className="flex flex-col items-start text-gray-600">
                  <span>Ngày:</span>
                  {formattedDate}
                </div>

                {/* Thông tin ghế */}
                <div className=" hidden lg:block text-gray-700">
                  Ghế: {reservedSeats.length}/{trip.seats.length}
                </div>

                {/* Giá vé */}
                <div className="hidden lg:block text-xl font-semibold text-teal-600">
                  {formatCurrency(trip.price)}
                </div>

                {/* Nút hành động */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              {/* Chế độ chỉnh sửa */}
              {editMode && currentTrip?.id === trip.id && (
                <div className=" w-[90%] m-auto p-3 text-black flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">
                      Địa điểm đi:
                    </label>
                    <input
                      type="text"
                      value={currentTrip?.from_location}
                      onChange={(e) =>
                        setCurrentTrip({
                          ...currentTrip!,
                          from_location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">
                      Địa điểm đến:
                    </label>
                    <input
                      type="text"
                      value={currentTrip?.to_location}
                      onChange={(e) =>
                        setCurrentTrip({
                          ...currentTrip!,
                          to_location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Loại xe:
                    </label>
                    <input
                      type="text"
                      value={currentTrip?.bus_type}
                      onChange={(e) =>
                        setCurrentTrip({
                          ...currentTrip!,
                          bus_type: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Thời gian di chuyển:
                    </label>
                    <input
                      type="text"
                      value={currentTrip?.travel_time}
                      onChange={(e) =>
                        setCurrentTrip({
                          ...currentTrip!,
                          travel_time: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Ngày khởi hành:
                    </label>
                    <input
                      type="date"
                      value={currentTrip?.departure_time.slice(0, 10)}
                      onChange={(e) =>
                        setCurrentTrip({
                          ...currentTrip!,
                          departure_time: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Giá vé:
                    </label>
                    <input
                      type="text"
                      value={currentTrip?.price}
                      onChange={(e) =>
                        setCurrentTrip({
                          ...currentTrip!,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleSave(trip.id)}
                      className="w-full px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="w-full px-4 py-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTrips;
