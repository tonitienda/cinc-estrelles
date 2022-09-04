// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Reservation } from "../../model/reservation";

const FakeReservationsData: Reservation[] = [
  {
    id: "87b26d3d-8338-49bc-9f46-f12dc57cd3ce",
    customerEmail: "jane.doe@example.com",
    customerName: "Jane Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 1,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "c43382f3-f50e-4597-acfa-9d2c3d96ca37",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "d7a4ad66-c095-4e83-b701-489965c64ad3",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "2fcd59ae-da12-4c68-b6fe-2659e91fdaaf",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 3,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "bb362a17-b3c3-4df7-810b-ada45dca4f2c",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "f6e31b51-ae4c-4cae-a746-9f3b37a59bc9",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
  {
    id: "f27307c3-9d01-4134-b5c9-d4bca42d616c",
    customerEmail: "john.doe@example.com",
    customerName: "John Doe",
    checkin: "2022-10-05",
    checkout: "2022-10-07",
    nights: 2,
    numAdults: 2,
    numChildren: 0,
    roomType: "suite",
    source: {
      origin: "booking",
      reservationId: "booking-1234",
    },
  },
];

// We are formatting the reservations that come from the backend
// in a way that are easily processed by the Frontend.
// If performance becomes an issue, we can start optimizing for query
// TODO - Calculate nights based on checkin / checkout
const formatReservation = (reservation: Reservation) => ({
  ...reservation,
  nights: 2,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reservation[]>
) {
  const backendRes = await fetch(
    "http://reservations-backend:3000/reservations"
  );
  console.log(backendRes.status);
  console.log(backendRes.statusText);
  const reservations = await backendRes.json();
  res.status(200).json(reservations.map(formatReservation));
}
