import { IBookTicket } from "@/types/bookTickets";
import { updateTicketStatus } from "@/service/ticketsService";
interface IChangeTicketStatus {
  ticket_id: string;
  status: string;
  expires_at: string | null;
}
//  xử lý khi thanh toán thành công
export const handlePaymentSuccess = async (
  bookTicketsData: IBookTicket[] | null
) => {
  if (!bookTicketsData || bookTicketsData.length === 0) {
    console.error("No tickets available.");
    return;
  }

  const changeTicketStatus: IChangeTicketStatus[] = bookTicketsData.map(
    ({ ticket_id }) => ({
      ticket_id: ticket_id || "",
      status: "Đã thanh toán",
      expires_at: null,
    })
  );

  console.log("Change ticket status:", changeTicketStatus);

  try {
    // Gửi yêu cầu cập nhật trạng thái vé
    const updatePaymentStatus = await updateTicketStatus(
      "https://my-server-3exfcj6u4-thanh-hais-projects-0e39a8d1.vercel.app/tickets/status",
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
