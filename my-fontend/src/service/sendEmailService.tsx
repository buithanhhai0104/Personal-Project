import axios from "axios";
import { ISendEmail } from "@/types/sendEmail";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

export const apisendEmail = async (sendEmailForm: ISendEmail) => {
  try {
    const response = await axios.post(`${apiUrl}/send-email`, sendEmailForm, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.log("Lỗi gửi email khi thanh toán thành công", err);
  }
};
