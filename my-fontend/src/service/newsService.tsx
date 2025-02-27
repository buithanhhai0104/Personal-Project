import { INews } from "@/types/news";
import axios from "axios";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

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
export const updateNewsById = async (newsData: INews, newsId: number) => {
  try {
    const res = await axios.put(`${apiUrl}/news/${newsId}`, newsData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Lỗi sửa dữ liệu bài báo theo ID:", error);

    return {
      success: false,
      error: "Không thể thay đổi dữ liệu bài báo",
    };
  }
};

export const getAllNews = async () => {
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

export const deleteNewsById = async (id: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/news/${id}`);
    return response.data;
  } catch (err) {
    console.log("Lỗi xóa bài báo theo id", err);
  }
};

export const apiCreateNews = async (newsData: FormData) => {
  try {
    const res = await axios.post(`${apiUrl}/news`, newsData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
