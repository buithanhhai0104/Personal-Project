import { ICreateTrip, ITrips } from "@/types/trips";
import axios from "axios";

interface IParams {
  from_location: string;
  to_location: string;
  departure_date: string;
}

export const getAllTrips = async () => {
  try {
    const response = await axios.get(
      "https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/api/trips"
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi gọi api Trips", err);
  }
};

export const createTrip = async (createTripForm: ICreateTrip) => {
  try {
    const response = await axios.post(
      "https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/api/trips",
      createTripForm,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi thêm chuyến xe", err);
  }
};
export const deleteTrip = async (id: number) => {
  try {
    const response = await axios.delete(
      `https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/api/trips/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi xóa chuyến xe", err);
  }
};

export const UpdateTripbyId = async (
  id: number,
  modifiedTrip: ITrips | null
) => {
  try {
    if (modifiedTrip?.departure_time) {
      modifiedTrip.departure_time = new Date(modifiedTrip.departure_time)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    const respone = await axios.put(
      `https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/api/trips/${id}`,
      modifiedTrip,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return respone.data;
  } catch (err) {
    console.log("Lỗi chỉnh sửa chuyến đi", err);
  }
};

export const getTripById = async (id: number) => {
  try {
    const response = await axios.get(
      `https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/api/trips/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi gọi api trip theo id", err);
  }
};

export const apiTripsSearch = async (params: IParams) => {
  try {
    const response = await axios.get(
      "https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/api/search",
      {
        params,
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi gọi api tìm kiếm chuyến xe", err);
  }
};
