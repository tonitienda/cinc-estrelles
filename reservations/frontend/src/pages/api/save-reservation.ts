// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Reservation } from "../../model/reservation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reservation | null>
) {
  const reservation = req.body;
  console.log(`Saving API`, reservation);
  try {
    const backendRes = await fetch(
      `http://reservations-backend:3000/save-reservation`,
      {
        method: "POST",
        body: reservation,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await backendRes.json();

    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(null);
  }
}
