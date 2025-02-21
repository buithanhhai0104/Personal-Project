import React, { useEffect, useState } from "react";
import { deleteTicketById, getTickets } from "@/service/ticketsService";
import { IBookTicket } from "@/types/bookTickets";
import { FaDotCircle, FaMapMarkerAlt } from "react-icons/fa";
import LoadingSpinner from "../loadingSpinner";
type AllTicketsProps = {
  type: "Tất cả vé" | "Vé đã thanh toán" | "Vé chưa thanh toán" | "Vé đã hủy";
};
const AllTickets: React.FC<AllTicketsProps> = ({ type }) => {
  const [tickets, setTickets] = useState<IBookTicket[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleDeleteTicket = (id: string) => {
    const deleteTicket = async () => {
      try {
        const res = await deleteTicketById(id);
        if (res) {
          alert("Xóa vé thành công");
          fetchAllTickets();
        }
      } catch (err) {
        console.log("Lỗi xóa vé", err);
      }
    };
    deleteTicket();
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }
  if (!currentTickets || currentTickets.length === 0) {
    return (
      <div className=" text-2xl text-center py-4 text-red-600">
        Không có vé nào để hiển thị.
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Danh Sách Vé</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Mã số xe</th>
              <th className="border border-gray-300 px-4 py-2">Chuyến đi từ</th>
              <th className="border border-gray-300 px-4 py-2">Số ghế</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th className="hidden lg:table-cell border border-gray-300 px-4 py-2">
                Thời gian đặt
              </th>
              <th className="hidden lg:table-cell border border-gray-300 px-4 py-2">
                Hết hạn
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
                  <div className="flex flex-col text-black">
                    <span className="text-[#00613D] font-semibold ">
                      <div className="flex text-[12px] flex-1 justify-center items-center">
                        {ticket.from_location}
                        <FaDotCircle className="m-3" />
                        <div className=" flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>

                        <div className=" flex-1 h-[1px] w-6 bg-gray-300 rounded-full"></div>
                        <FaMapMarkerAlt className="m-3" />
                        {ticket.to_location}
                      </div>
                    </span>
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
                <td className="hidden lg:table-cell border border-gray-300 px-4 py-2">
                  {ticket.booking_time
                    ? new Date(ticket.booking_time).toLocaleString("vi-VN")
                    : "N/A"}
                </td>
                <td className="hidden lg:table-cell border border-gray-300 px-4 py-2">
                  {ticket.expires_at
                    ? new Date(ticket.expires_at).toLocaleString("vi-VN")
                    : "N/A"}
                </td>
                <td className=" flex flex-col border border-gray-300 px-4 py-2 space-y-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() =>
                      alert(
                        `Chi tiết khách hàng đặt vé:
                        - Tên : ${ticket.name}
                        - Số điện thoại: ${ticket.phone}
                        - Email: ${ticket.email}`
                      )
                    }
                  >
                    Chi tiết
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() =>
                      handleDeleteTicket(ticket.ticket_id as string)
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTickets;
