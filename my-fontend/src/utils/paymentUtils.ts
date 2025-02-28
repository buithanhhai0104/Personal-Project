import { IBookTicket } from "@/types/bookTickets";
import { updateTicketStatus } from "@/service/ticketsService";
interface IChangeTicketStatus {
  ticket_id: string;
  status: string;
  expires_at: string | null;
}
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-personal-project.vercel.app";

//  xử lý khi thanh toán thành công
export const handlePaymentSuccess = async (
  bookTicketsData: IBookTicket | null
) => {
  if (!bookTicketsData) {
    console.error("No tickets available.");
    return;
  }

  const changeTicketStatus: IChangeTicketStatus = {
    ticket_id: bookTicketsData.ticket_id || "",
    status: "Đã thanh toán",
    expires_at: null,
  };
  console.log("Change ticket status:", changeTicketStatus);

  try {
    // Gửi yêu cầu cập nhật trạng thái vé
    const updatePaymentStatus = await updateTicketStatus(
      `${apiUrl}/tickets/status`,
      changeTicketStatus
    );
    if (updatePaymentStatus) {
      console.log("Ticket status updated successfully:", updatePaymentStatus);
      return { success: true };
    } else {
      console.error("Payment update failed:", updatePaymentStatus);
      return {
        success: false,
        message: "Cập nhật trạng thái vé không thành công.",
      };
    }
  } catch (err) {
    console.error("Error updating ticket status:", err);
    return {
      success: false,
      message: "Có lỗi xảy ra khi cập nhật trạng thái vé.",
    };
  }
};
