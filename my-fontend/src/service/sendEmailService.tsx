import axios from "axios";
import { ISendEmail } from "@/types/sendEmail";
export const apisendEmail = async (sendEmailForm: ISendEmail) => {
  try {
    const response = await axios.post(
      "https://backend-personal-project.vercel.app/send-email",
      sendEmailForm,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi gửi email khi thanh toán thành công", err);
  }
};
