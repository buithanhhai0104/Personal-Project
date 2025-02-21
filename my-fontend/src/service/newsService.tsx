import { INews } from "@/types/news";
import axios from "axios";

// Lấy URL API từ biến môi trường (mặc định là production)
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

/**
 * Lấy bài báo theo ID
 */
export const getNewsById = async (newsId: string) => {
  try {
    const res = await axios.get(`${apiUrl}/news/${newsId}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu bài báo theo ID:", error);

    return {
      success: false,
      error: "Không thể lấy bài báo",
    };
  }
};

/**
 * Lấy tất cả bài báo
 */
export const getNewsAll = async () => {
  try {
    const res = await axios.get(`${apiUrl}/news`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách bài báo:", error);

    return {
      success: false,
      error: "Không thể lấy danh sách bài báo",
    };
  }
};

/**
 * Tạo bài báo mới
 */
export const createNews = async (newsData: INews) => {
  try {
    const res = await axios.post(`${apiUrl}/news`, newsData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data || "Lỗi từ server",
      };
    }

    console.error("Lỗi thêm bài báo:", error);

    return {
      success: false,
      error: "Không thể thêm bài báo",
    };
  }
};
