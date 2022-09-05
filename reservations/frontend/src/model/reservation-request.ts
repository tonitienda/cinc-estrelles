export type ReservationRequest = {
  id?: string;
  customer?: {
    cname?: string;
    email?: string;
  };
  reservation?: {
    checkin?: string;
    checkout?: string;
    numAdults?: number;
    numChildren?: number;
    roomType?: string;
    specialRequests?: string;
    // Properties not in schema that will be calculated in the backend
    nights?: number;
  };
  source?: {
    origin: string;
    reservationId: string;
  };
  [k: string]: any;
};
