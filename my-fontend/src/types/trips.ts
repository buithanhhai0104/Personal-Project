export interface ISeats {
  seat_number: string;
  status: string;
}

export interface ITrips {
  id: number;
  from_location: string;
  to_location: string;
  bus_type: string;
  price: number;
  travel_time: string;
  departure_time: string;
  start_time: string;
  arrival_time: string;
  seats: ISeats[];
}

export interface ICreateTrip {
  from_location: string;
  to_location: string;
  bus_type: string;
  price: number;
  travel_time: string;
  departure_time: string;
  start_time: string;
  arrival_time: string;
}
