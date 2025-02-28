"use client";
import { useState, useEffect } from "react";
import TripHistory from "@/components/user/tripHistory";
import { FaBars, FaTimes } from "react-icons/fa";
import { ReactNode } from "react";

type ActiveComponent = "infomation" | "tripHistory";

const User = () => {
  const [activeComponent, setActiveComponent] =
    useState<ActiveComponent>("tripHistory");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const componentMap: Record<ActiveComponent, ReactNode> = {
    tripHistory: <TripHistory />,
    infomation: <div>123</div>,
  };

  const renderComponent = () => componentMap[activeComponent] || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeComponent]);

  return (
    <div className=" flex relative top-20 w-full">
      {/* Nút mở sidebar trên mobile */}
      <button
        className="md:hidden fixed z-50 top-4 left-3 bg-orange-500 text-white p-2 rounded-full shadow-md "
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars size={30} />
      </button>

      {/* Sidebar */}
      <div
        className={` mt-[80px] z-50 sm:mt-0 bg-white shadow-lg border-r border-gray-200 
    w-[70%] sm:w-[50%] md:w-[25%] 
    transition-transform duration-300 ease-in-out 
    fixed top-0 left-0 bottom-0 md:sticky md:top-[60px] md:h-[calc(100vh-60px)] 
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <div className="p-4 border-b border-gray-300 text-center text-xl font-semibold text-orange-600 flex justify-between items-center">
          <span className="flex-1">Hồ sơ</span>
          {/* Nút đóng sidebar trên mobile */}
          <button
            className="md:hidden text-red-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={25} />
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="flex flex-col">
            <li>
              <button
                onClick={() => {
                  setActiveComponent("infomation");
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-lg font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors ${
                  activeComponent === "infomation"
                    ? "bg-orange-50 text-orange-600"
                    : ""
                }`}
              >
                <span>Thông tin cá nhân</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveComponent("tripHistory");
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-lg font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors ${
                  activeComponent === "tripHistory"
                    ? "bg-orange-50 text-orange-600"
                    : ""
                }`}
              >
                <span>Lịch sử đặt vé</span>
              </button>
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

export default User;
