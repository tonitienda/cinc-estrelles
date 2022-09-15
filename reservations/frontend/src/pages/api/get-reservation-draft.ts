// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Reservation } from "../../model/reservation";

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
  res: NextApiResponse<Reservation>
) {
  console.log(req.query.id);
  const backendRes = await fetch(
    `http://reservations-backend:3000/reservation-drafts/${req.query.id}`
  );

  console.log(backendRes);
  const reservation: Reservation = await backendRes.json();
  res.status(200).json(formatReservation(reservation));
}
