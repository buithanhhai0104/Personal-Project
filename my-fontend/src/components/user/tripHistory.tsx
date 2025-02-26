"use client";

import { getTickets } from "@/service/ticketsService";
import { IBookTicket } from "@/types/bookTickets";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/authContext";
import { FaDotCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const TripHistory = () => {
  const [ticketsList, setTicketList] = useState<IBookTicket[] | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchTrips = async () => {
      const res = await getTickets();
      if (Array.isArray(res)) {
        setTicketList(res.filter((item) => item.user_id === user?.id));
      }
    };
    fetchTrips();
  }, [user?.id]);

  const newTicketsList = ticketsList
    ?.filter((t) => t.booking_time)
    .sort(
      (a, b) =>
        new Date(b.booking_time!).getTime() -
        new Date(a.booking_time!).getTime()
    );

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Lịch sử đặt vé</h1>

      {/* Dạng Bảng trên Màn hình Lớn */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Mã số xe</th>
              <th className="border border-gray-300 px-4 py-2">Chuyến đi</th>
              <th className="border border-gray-300 px-4 py-2">Số ghế</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th className="hidden md:table-cell border border-gray-300 px-4 py-2">
                Thời gian đặt
              </th>

              <th className="border border-gray-300 px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {newTicketsList?.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                className="hover:bg-gray-100 text-center"
              >
                <td className="border border-gray-300 px-2 py-2">
                  {ticket.ticket_id}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {ticket.trip_id}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <div className="flex items-center justify-center text-black text-xs">
                    {ticket.from_location} <FaDotCircle className="mx-2" />
                    <div className="w-6 h-[1px] bg-gray-300"></div>
                    <FaMapMarkerAlt className="mx-2" /> {ticket.to_location}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.seat_number}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    ticket.status === "Hủy đặt vé do chưa thanh toán"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {ticket.status}
                </td>
                <td className="hidden md:table-cell border border-gray-300 px-4 py-2">
                  {ticket.booking_time
                    ? new Date(ticket.booking_time).toLocaleString("vi-VN")
                    : "N/A"}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => router.push(`check/${ticket.ticket_id}`)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dạng Danh Sách trên Mobile */}
      <div className=" w-full sm:hidden space-y-4">
        {newTicketsList?.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="border p-4 rounded shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-blue-600">
                Vé #{ticket.ticket_id}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  ticket.status === "Hủy đặt vé do chưa thanh toán"
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            <div className="mt-2 text-gray-700 text-sm">
              <p>
                <strong>Xe:</strong> {ticket.trip_id}
              </p>
              <p>
                <strong>Ghế:</strong> {ticket.seat_number}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                {ticket.from_location} → {ticket.to_location}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Đặt:{" "}
                {ticket.booking_time
                  ? new Date(ticket.booking_time).toLocaleString("vi-VN")
                  : "N/A"}
              </p>
            </div>
            <button
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              onClick={() => router.push(`check/${ticket.ticket_id}`)}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripHistory;
