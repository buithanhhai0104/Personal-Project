import { IBookTicket } from "@/types/bookTickets";
import axios from "axios";

export const bookTickets = async (bookticketData: IBookTicket) => {
  try {
    const response = await axios.post(
      "https://backend-personal-project.vercel.app/tickets/book-ticket",
      bookticketData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error booking tickets:", err);
  }
};

export const checkTickets = async (id: string) => {
  try {
    const response = await axios.get(
      `https://backend-personal-project.vercel.app/tickets/${id}`
    );
    return response.data;
  } catch (err) {
    console.log("Error check tickets", err);
  }
};

interface IChangeTicketStatus {
  ticket_id: string;
  status: string;
  expires_at: string | null;
}
interface UpdateTicketStatusResponse {
  success: boolean;
  message?: string;
}

export const updateTicketStatus = async (
  url: string,
  changeTicketStatus: IChangeTicketStatus[]
): Promise<UpdateTicketStatusResponse> => {
  try {
    const response = await axios.put(url, { changeTicketStatus });
    return response.data;
  } catch (err) {
    console.error("Error updating ticket status:", err);
    throw new Error("Updating ticket status failed");
  }
};

export const getTickets = async () => {
  try {
    const response = await axios.get(
      "https://backend-personal-project.vercel.app/tickets"
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi khi lấy dữ liệu tất cả vé", err);
  }
};
export const deleteTicketById = async (id: string) => {
  try {
    const response = await axios.delete(
      `https://backend-personal-project.vercel.app/tickets/${id}`
    );
    return response.data;
  } catch (err) {
    console.log("Lỗi xóa vé theo id", err);
  }
};
