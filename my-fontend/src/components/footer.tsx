const Footer = () => {
  return (
    <footer className=" w-full z-49  bg-orange-100  py-6 text-white shadow-custom">
      <div className="container w-[90%] mx-auto  px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Cột 1 */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-orange-500 hover:text-orange-700 transition duration-200">
            TRUNG TÂM TỔNG ĐÀI & CSKH
          </h2>
          <p className="text-lg font-semibold text-gray-700">
            CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES
          </p>
          <p className="text-gray-600">
            Email:{" "}
            <a
              href="mailto:hotro@futa.vn"
              className="text-orange-500 hover:text-orange-700 hover:underline transition duration-200"
            >
              hotro@futa.vn
            </a>
          </p>
          <p className="text-gray-600">
            Điện thoại: <span className="font-bold">0283*******</span>
          </p>
        </div>

        {/* Cột 2 */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            FUTA Bus Lines
          </h3>
          <ul className="space-y-1 text-gray-600">
            {[
              "Về chúng tôi",
              "Lịch trình",
              "Tuyển dụng",
              "Tin tức & Sự kiện",
              "Mạng lưới văn phòng",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-orange-500 transition duration-200"
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Hỗ trợ</h3>
          <ul className="space-y-1 text-gray-600">
            {[
              "Tra cứu thông tin đặt vé",
              "Điều khoản sử dụng",
              "Câu hỏi thường gặp",
              "Hướng dẫn đặt vé trên Web",
              "Hướng dẫn nạp tiền trên App",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-orange-500 transition duration-200"
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
