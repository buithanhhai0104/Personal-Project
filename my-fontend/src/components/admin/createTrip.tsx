"use client";

import React, { useState } from "react";
import { ICreateTrip } from "@/types/trips";
import { createTrip } from "@/service/tripService";
import { allAddress } from "@/staticData/addresses";

const CreateTrip: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ICreateTrip>({
    from_location: "",
    to_location: "",
    bus_type: "",
    travel_time: "",
    start_time: "",
    arrival_time: "",
    departure_time: "",
    price: 0,
  });

  const validateForm = (): boolean => {
    if (
      !formData.from_location ||
      !formData.to_location ||
      !formData.bus_type
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return false;
    }
    if (formData.price <= 0) {
      setError("Giá vé phải lớn hơn 0.");
      return false;
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const convertDateToMySQLFormat = (date: string) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedData = {
      ...formData,
      departure_time: convertDateToMySQLFormat(formData.departure_time),
    };

    const create = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await createTrip(formattedData);
        if (res) {
          // setFormData({
          //   from_location: "",
          //   to_location: "",
          //   bus_type: "",
          //   travel_time: "",
          //   start_time: "",
          //   arrival_time: "",
          //   departure_time: "",
          //   price: 0,
          // });
          alert("Thêm chuyến xe thành công");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tạo chuyến đi. Vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };

    create();
  };

  return (
    <div className="w-[95%] md:w-[85%] mx-auto p-6 bg-gray-100 shadow-custom rounded-lg text-black">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Tạo Chuyến Đi</h1>
      {isLoading && <p className="text-blue-600">Đang xử lý...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="from_location"
            className="block text-sm font-medium text-gray-700"
          >
            Điểm đi
          </label>
          <select
            id="from_location"
            name="from_location"
            value={formData.from_location}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Chọn điểm đi
            </option>
            {allAddress.map((item, index) => {
              return <option key={index}>{item}</option>;
            })}
          </select>
        </div>

        <div>
          <label
            htmlFor="to_location"
            className="block text-sm font-medium text-gray-700"
          >
            Điểm đến
          </label>
          <select
            id="to_location"
            name="to_location"
            value={formData.to_location}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Chọn điểm đến
            </option>
            {allAddress.map((item, index) => {
              return <option key={index}>{item}</option>;
            })}
          </select>
        </div>

        <div>
          <label
            htmlFor="bus_type"
            className="block text-sm font-medium text-gray-700"
          >
            Loại xe
          </label>
          <select
            id="bus_type"
            name="bus_type"
            value={formData.bus_type}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Chọn loại xe
            </option>
            <option value="Limousine">Limousine</option>
            <option value="Ghế">Ghế</option>
            <option value="Giường">Giường</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="travel_time"
            className="block text-sm font-medium text-gray-700"
          >
            Thời gian di chuyển
          </label>
          <input
            type="text"
            id="travel_time"
            name="travel_time"
            value={formData.travel_time}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập thời gian di chuyển (ví dụ: 5 giờ)"
            required
          />
        </div>

        <div>
          <label
            htmlFor="start_time"
            className="block text-sm font-medium text-gray-700"
          >
            Giờ khởi hành
          </label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="arrival_time"
            className="block text-sm font-medium text-gray-700"
          >
            Giờ đến
          </label>
          <input
            type="time"
            id="arrival_time"
            name="arrival_time"
            value={formData.arrival_time}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="departure_time"
            className="block text-sm font-medium text-gray-700"
          >
            Ngày xuất phát
          </label>
          <input
            type="date"
            id="departure_time"
            name="departure_time"
            value={formData.departure_time}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Giá vé:
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Nhập giá vé"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Tạo chuyến đi
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
