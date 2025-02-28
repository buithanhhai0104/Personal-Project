"use client";
import React, { useEffect, useState } from "react";
import { deleteTicketById, getTickets } from "@/service/ticketsService";
import { IBookTicket } from "@/types/bookTickets";
import LoadingSpinner from "../loadingSpinner";

type AllTicketsProps = {
  type: "Tất cả vé" | "Vé đã thanh toán" | "Vé chưa thanh toán" | "Vé đã hủy";
};

const AllTickets: React.FC<AllTicketsProps> = ({ type }) => {
  const [tickets, setTickets] = useState<IBookTicket[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchAllTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTickets();
      if (res) {
        setTickets(res);
      }
    } catch (err) {
      console.error("Lỗi lấy tất cả chuyến đi:", err);
      setError("Không thể tải dữ liệu vé. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const filterTickets = (type: string, tickets: IBookTicket[] | null) => {
    if (!tickets) return null;
    switch (type) {
      case "Tất cả vé":
        return tickets;
      case "Vé đã thanh toán":
        return tickets.filter((e) => e.status === "Đã thanh toán");
      case "Vé chưa thanh toán":
        return tickets.filter((e) => e.status === "Chưa thanh toán");
      case "Vé đã hủy":
        return tickets.filter(
          (e) => e.status === "Hủy đặt vé do chưa thanh toán"
        );
      default:
        return [];
    }
  };

  const currentTickets = React.useMemo(() => {
    return filterTickets(type, tickets);
  }, [type, tickets]);

  const confirmDeleteTicket = async () => {
    if (confirmDelete) {
      try {
        const res = await deleteTicketById(confirmDelete);
        if (res) {
          alert("Xóa vé thành công");
          fetchAllTickets();
        }
      } catch (err) {
        console.log("Lỗi xóa vé", err);
      } finally {
        setConfirmDelete(null);
      }
    }
  };
  console.log(currentTickets);
  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }
  if (!currentTickets || currentTickets.length === 0) {
    return (
      <div className="text-2xl text-center py-4 text-red-600">
        Không có vé nào để hiển thị.
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Danh Sách Vé</h1>
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">Bạn có chắc chắn muốn xóa vé này không?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDeleteTicket}
              >
                Xác nhận
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="hidden lg:table table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Mã số xe</th>
              <th className="border border-gray-300 px-4 py-2">Chuyến đi từ</th>
              <th className="border border-gray-300 px-4 py-2">Số ghế</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th className="border border-gray-300 px-4 py-2">
                Thời gian đặt vé
              </th>
              <th className="border border-gray-300 px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets?.map((ticket) => (
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
                  {ticket.from_location} → {ticket.to_location}
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
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.booking_time}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex flex-col gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Chi tiết
                  </button>
                  <button
                    onClick={() => setConfirmDelete(ticket.ticket_id as string)}
                    className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lg:hidden space-y-4">
          {currentTickets?.map((ticket) => (
            <div
              key={ticket.ticket_id}
              className="border p-4 rounded-lg shadow"
            >
              <p>
                <strong>ID:</strong> {ticket.ticket_id}
              </p>
              <p>
                <strong>Mã số xe:</strong> {ticket.trip_id}
              </p>
              <p>
                <strong>Chuyến đi:</strong> {ticket.from_location} →{" "}
                {ticket.to_location}
              </p>
              <p>
                <strong>Số ghế:</strong> {ticket.seat_number}
              </p>
              <p>
                <strong>Thời gian đặt:</strong> {ticket.booking_time}
              </p>
              <p
                className={
                  ticket.status === "Hủy đặt vé do chưa thanh toán"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                <strong>Trạng thái:</strong> {ticket.status}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  onClick={() =>
                    alert(
                      `Chi tiết khách hàng:\nTên: ${ticket.name}\nSĐT: ${ticket.phone}\nEmail: ${ticket.email}`
                    )
                  }
                >
                  Chi tiết
                </button>
                <button
                  onClick={() => setConfirmDelete(ticket.ticket_id as string)}
                  className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
