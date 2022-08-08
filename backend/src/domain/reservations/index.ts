import { Router } from "express";
import * as db from "../../tools/db-client";
import * as broker from "../../tools/broker";

// TODO - Import from module. Doing .. out of the boundaries of
// reservations seems not correct
import { handleCommandRequest } from "../../handlers/command";
import * as importReservation from "./import-reservation";

type ReservationDependencies = importReservation.Dependencies;

export const get = (dependencies: ReservationDependencies) => {
  const router = Router();

  router.post(
    "/import-reservation",
    handleCommandRequest(importReservation.execute(dependencies))
  );
  return router;
};
