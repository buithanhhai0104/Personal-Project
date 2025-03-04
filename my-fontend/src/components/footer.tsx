const Footer = () => {
  return (
    <footer className=" w-full z-49  mt-2 bg-[#3b82f6] py-6 text-white shadow-custom">
      <div className="container w-[90%] mx-auto  px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Cột 1 */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white hover:text-orange-700 transition duration-200">
            TRUNG TÂM TỔNG ĐÀI & CSKH
          </h2>
          <p className="text-lg font-semibold text-white ">
            CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES
          </p>
          <p className="text-white">
            Email:{" "}
            <a
              href="mailto:hotro@futa.vn"
              className="text-red-500  hover:text-white hover:underline transition duration-200"
            >
              hotro@futa.vn
            </a>
          </p>
          <p className="text-white">
            Điện thoại: <span className="font-bold">0283*******</span>
          </p>
        </div>

        {/* Cột 2 */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold text-white">FUTA Bus Lines</h3>
          <ul className="space-y-1 text-white">
            {[
              "Về chúng tôi",
              "Lịch trình",
              "Tuyển dụng",
              "Tin tức & Sự kiện",
              "Mạng lưới văn phòng",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-red-500  transition duration-200 cursor-pointer"
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold text-white">Hỗ trợ</h3>
          <ul className="space-y-1 text-white">
            {[
              "Tra cứu thông tin đặt vé",
              "Điều khoản sử dụng",
              "Câu hỏi thường gặp",
              "Hướng dẫn đặt vé trên Web",
              "Hướng dẫn nạp tiền trên App",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-red-500  transition duration-200 cursor-pointer"
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
