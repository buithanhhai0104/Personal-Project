"use client";
import AllTickets from "@/components/admin/allTickets";
import AllTrips from "@/components/admin/allTrips";
import CreateTrip from "@/components/admin/createTrip";
import Users from "@/components/admin/users";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";
import CreateNews from "@/components/admin/createNews";
type ActiveComponent =
  | "createTrip"
  | "allTrips"
  | "users"
  | "allTickets"
  | "paidTickets"
  | "unpaidTickets"
  | "canceledTickets"
  | "news";

const Manage = () => {
  const [showTripsList, setShowTripsList] = useState<boolean>(false);
  const [showTicketsList, setShowTicketsList] = useState<boolean>(false);
  const [activeComponent, setActiveComponent] =
    useState<ActiveComponent>("allTrips");
  const user = useUser();
  const router = useRouter();
  const componentMap: Record<ActiveComponent, ReactNode> = {
    createTrip: <CreateTrip />,
    allTrips: <AllTrips />,
    users: <Users />,
    news: <CreateNews />,
    allTickets: <AllTickets type="Tất cả vé" />,
    paidTickets: <AllTickets type="Vé đã thanh toán" />,
    unpaidTickets: <AllTickets type="Vé chưa thanh toán" />,
    canceledTickets: <AllTickets type="Vé đã hủy" />,
  };

  const renderComponent = () => componentMap[activeComponent] || null;

  const tripManagementList = [
    { name: "Tất cả chuyến đi", key: "allTrips" },
    { name: "Thêm chuyến đi", key: "createTrip" },
  ];
  const ticketManagementList = [
    { name: "Tất cả vé", key: "allTickets" },
    { name: "Vé đã thanh toán", key: "paidTickets" },
    { name: "Vé chưa thanh toán", key: "unpaidTickets" },
    { name: "Vé đã hủy", key: "canceledTickets" },
  ];

  useEffect(() => {
    if (user && user.user === null) return;
    if (!user?.user || user?.user?.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  if (!user.user || user.user?.role !== "admin") return null;

  return (
    <div className="flex relative top-[60px] w-full">
      {/* Sidebar */}
      <div className="w-[25%] sticky top-[80px] h-screen bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-300 text-center text-xl font-semibold text-[#3b82f6]">
          Quản lý
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="flex flex-col">
            {/* Trips Management */}
            <li>
              <button
                onClick={() => setShowTripsList((prev) => !prev)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-lg font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors ${
                  showTripsList ? "bg-orange-50 text-orange-600" : ""
                }`}
              >
                <span>Quản lý chuyến đi</span>
                <span
                  className={`transition-transform ${
                    showTripsList ? "rotate-180" : ""
                  }`}
                >
                  {showTripsList ? <BsChevronDown /> : <BsChevronRight />}
                </span>
              </button>
              {showTripsList && (
                <div className="flex flex-col items-start p-3 gap-2 transition-all">
                  {tripManagementList.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveComponent(item.key as ActiveComponent)
                      }
                      className={`text-base px-2 py-1 rounded hover:bg-orange-100 hover:text-orange-600 ${
                        activeComponent === item.key
                          ? "bg-orange-50 font-medium text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
            {/* Users Management */}
            <li>
              <button
                onClick={() => setActiveComponent("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-lg font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors ${
                  activeComponent === "users"
                    ? "bg-orange-50 text-orange-600"
                    : ""
                }`}
              >
                <span>Quản lý người dùng</span>
              </button>
            </li>
            {/* Users Management */}
            <li>
              <button
                onClick={() => setActiveComponent("news")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-lg font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors ${
                  activeComponent === "users"
                    ? "bg-orange-50 text-orange-600"
                    : ""
                }`}
              >
                <span>Quản lý bài báo</span>
              </button>
            </li>
            {/* Tickets Management */}
            <li>
              <button
                onClick={() => setShowTicketsList((prev) => !prev)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-lg font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors ${
                  showTicketsList ? "bg-orange-50 text-orange-600" : ""
                }`}
              >
                <span>Quản lý vé</span>
                <span
                  className={`transition-transform ${
                    showTicketsList ? "rotate-180" : ""
                  }`}
                >
                  {showTicketsList ? <BsChevronDown /> : <BsChevronRight />}
                </span>
              </button>
              {showTicketsList && (
                <div className="flex flex-col items-start p-3 gap-2 transition-all">
                  {ticketManagementList.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveComponent(item.key as ActiveComponent)
                      }
                      className={`text-base px-2 py-1 rounded hover:bg-orange-100 hover:text-orange-600 ${
                        activeComponent === item.key
                          ? "bg-orange-50 font-medium text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-50 p-6">
        {renderComponent() || (
          <div className="text-center text-gray-500">
            Chọn một mục để xem nội dung
          </div>
        )}
      </div>
    </div>
  );
};

export default Manage;
