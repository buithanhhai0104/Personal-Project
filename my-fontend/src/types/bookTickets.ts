export interface IBookTicket {
  booking_time?: string;
  ticket_id?: string;
  to_location?: string;
  from_location?: string;
  user_id: number | undefined;
  trip_id: number;
  seat_numbers: string[];
  seat_number?: string;
  name: string;
  phone: string | undefined;
  email: string;
  status?: string;
  expires_at?: string;
}
