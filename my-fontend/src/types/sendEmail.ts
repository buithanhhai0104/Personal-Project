import { IBookTicket } from "./bookTickets";

export interface ISendEmail {
  to: string;
  subject: "Mã thông tin đặt vé ";
  tickets: IBookTicket[];
}
