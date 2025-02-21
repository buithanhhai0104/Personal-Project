import axios from "axios";
import { ISendEmail } from "@/types/sendEmail";

// Lấy URL API từ biến môi trường (mặc định là production)
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

/**
 * Gửi email thông báo thanh toán thành công
 */
export const apiSendEmail = async (sendEmailForm: ISendEmail) => {
  try {
    const response = await axios.post(`${apiUrl}/send-email`, sendEmailForm, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data || "Lỗi từ server",
      };
    }

    console.error("Lỗi gửi email khi thanh toán thành công:", error);

    return {
      success: false,
      error: "Không thể gửi email",
    };
  }
};
