import { Router } from "express";

import { handleCommandRequest } from "../../handlers/command";
import * as importReservation from "./import-reservation";
import * as findReservations from "./find-reservations";
import * as getReservation from "./get-reservation";
import { handleQueryRequest } from "../../handlers/query";
import { SystemDependencies } from "../../system";

export const get = (dependencies: SystemDependencies) => {
  const router = Router();

  router.post(
    "/import-reservation",
    handleCommandRequest(importReservation.execute(dependencies))
  );

  router.get(
    "/reservations/:id",
    handleQueryRequest(getReservation.execute(dependencies))
  );

  router.get(
    "/reservations",
    handleQueryRequest(findReservations.execute(dependencies))
  );

  return router;
};
