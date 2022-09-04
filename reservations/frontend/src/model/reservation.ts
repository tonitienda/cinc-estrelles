export type Reservation = {
  id?: string;
  customerName?: string;
  customerEmail?: string;
  checkin?: string;
  checkout?: string;
  numAdults?: number;
  numChildren?: number;
  roomType?: string;
  specialRequests?: string;
  source?: {
    origin: string;
    reservationId: string;
  };
  // Properties not in schema that will be calculated in the backend
  nights: number;
};
