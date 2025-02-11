import Image from "next/image";

const infoData = [
  {
    id: 1,
    title: "Hơn 20 Triệu",
    subtitle: "Lượt khách",
    description:
      "Phương Trang phục vụ hơn 20 triệu lượt khách bình quân 1 năm trên toàn quốc",
    icon: "https://cdn.futabus.vn/futa-busline-cms-dev/Group_662c4422ba/Group_662c4422ba.svg",
  },
  {
    id: 2,
    title: "Hơn 350",
    subtitle: "Phòng vé - Bưu cục",
    description:
      "Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến xe,... trên toàn hệ thống",
    icon: "https://cdn.futabus.vn/futa-busline-cms-dev/Store_55c0da8bd7/Store_55c0da8bd7.svg",
  },
  {
    id: 3,
    title: "Hơn 1,000",
    subtitle: "Chuyến xe",
    description:
      "Phương Trang phục vụ hơn 1,000 chuyến xe đường dài và liên tỉnh mỗi ngày",
    icon: "https://cdn.futabus.vn/futa-busline-cms-dev/Group_2_75b5ed1dfd/Group_2_75b5ed1dfd.svg",
  },
];

export default function InfoSection() {
  return (
    <div className="bg-white w-full p-10 shadow-custom">
      <div className="flex flex-col items-center mb-3">
        <h2 className="text-3xl text-center text-[#00613D] font-bold">
          FUTA BUS LINES - CHẤT LƯỢNG LÀ DANH DỰ
        </h2>
        <p className="text-center text-[#00613D]">
          Được khách hàng tin tưởng và lựa chọn
        </p>
      </div>
      <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row items-center">
        {/* Cột thông tin */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 gap-6">
            {infoData.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <Image
                  src={item.icon}
                  width={60}
                  height={60}
                  alt={item.title}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-black font-bold text-lg">
                    {item.title}{" "}
                    <span className="text-gray-600">{item.subtitle}</span>
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Hình ảnh minh họa */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
          <Image
            src="https://cdn.futabus.vn/futa-busline-cms-dev/image_f922bef1bb/image_f922bef1bb.svg"
            width={400}
            height={300}
            alt="Illustration"
          />
        </div>
      </div>
    </div>
  );
}
