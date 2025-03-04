"use client";

import { useUser } from "@/context/authContext";
import { apiLogout, getUser } from "@/service/authService";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import { Tooltip } from "react-tooltip";
import { FaCircleUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const Header: React.FC = () => {
  const navPage = [
    { title: "Trang chủ", to: "/" },
    { title: "Chuyến Đi", to: "/trips" },
    { title: "Tra cứu vé", to: "/check" },
    { title: "Tin tức", to: "/news" },
    { title: "Liên hệ", to: "/" },
    { title: "Về chúng tôi", to: "/" },
  ];

  const popup = [
    { title: "Hồ sơ", to: "/user" },
    { title: "Đăng xuất", to: "/" },
  ];

  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser();
        setUser(res.data.userdata);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickPopupItem = useCallback(
    async (title: string, to: string) => {
      if (title === "Đăng xuất") {
        try {
          const logout = await apiLogout();
          if (logout) {
            window.location.reload();
          }
        } catch (err) {
          console.log("Lỗi đăng xuất", err);
        }
      } else {
        router.push(to);
      }
    },
    [router]
  );

  return (
    <header className="fixed z-50 w-full bg-[#3b82f6] bg-opacity-90 h-20 ">
      <div className="flex justify-between gap-2 items-center w-[95%] m-auto">
        {/* Nút mở Sidebar */}
        <div
          className="flex md:hidden text-4xl cursor-pointer mt-2"
          onClick={() => setShowSideBar(!showSideBar)}
        >
          <IoReorderThreeSharp />
        </div>

        <Link href={"/"} className="mt-[5px] ml-5 md:ml-0">
          <Image width={70} height={70} src="/images/logo5.png" alt="logo" />
        </Link>

        <nav className="hidden md:flex gap-10 mt-2 ">
          {navPage.map((item, index) => (
            <Link
              className="flex flex-col p-3 font-medium group text-lg"
              key={index}
              href={item.to}
            >
              {item.title}
              <span className="h-[2px] w-0 bg-orange-400  transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {!user?.username ? (
          <Link
            className="flex text-[10px] justify-center  md:text-base mt-2 items-center gap-1 border-[1px] p-2 rounded-xl hover:border-orange-400 hover:text-orange-400"
            href={"/auth"}
          >
            <CiUser className="text-xl flex " />
            Tài khoản
          </Link>
        ) : (
          <div className="relative text-4xl mr-5">
            <div
              onClick={() => setIsOpen(!isOpen)}
              data-tip={isOpen ? "Đóng popup" : "Mở popup"}
              className="cursor-pointer hover:text-orange-400 mt-2"
            >
              <FaCircleUser />
            </div>
            <Tooltip />
            {isOpen && (
              <div
                ref={popupRef}
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-[150px] bg-[#3e3e3f] flex flex-col justify-center items-center rounded-xl text-[#ffff] text-[16px] mt-2"
              >
                {user.role === "admin" && (
                  <Link href={"/admin"} className="hover:text-orange-400">
                    Quản lý
                  </Link>
                )}
                {popup.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleClickPopupItem(item.title, item.to)}
                    className="text-white hover:text-orange-400"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      {showSideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowSideBar(false)}
        >
          <div
            className="fixed left-0 top-0 w-[250px] h-full text-black bg-white shadow-lg p-5 transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg text-[#3b82f6] font-semibold">Menu</h2>
              <IoClose
                className="text-3xl cursor-pointer"
                onClick={() => setShowSideBar(false)}
              />
            </div>
            <nav className="flex flex-col gap-5">
              {navPage.map((item, index) => (
                <Link
                  key={index}
                  href={item.to}
                  className="text-lg font-medium hover:text-[#3b82f6]"
                  onClick={() => setShowSideBar(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
