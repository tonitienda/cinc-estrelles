import { Router } from "express";

import { handleCommandRequest } from "../../handlers/command";
import * as importReservation from "./import-reservation";
import * as findReservations from "./find-reservations";
import * as findReservationRequests from "./find-reservation-drafts";
import * as getReservation from "./get-reservation";
import * as getReservationRequest from "./get-reservation-draft";
import * as saveReservation from "./save-reservation";
import { handleQueryRequest } from "../../handlers/query";
import { SystemDependencies } from "../../system";

export const get = (dependencies: SystemDependencies) => {
  const router = Router();

  router.post(
    "/import-reservation",
    handleCommandRequest(importReservation.execute(dependencies))
  );

  router.post(
    "/save-reservation",
    handleCommandRequest(saveReservation.execute(dependencies))
  );

  router.get(
    "/reservations/:id",
    handleQueryRequest(getReservation.execute(dependencies))
  );

  router.get(
    "/reservations",
    handleQueryRequest(findReservations.execute(dependencies))
  );

  router.get(
    "/reservation-drafts",
    handleQueryRequest(findReservationRequests.execute(dependencies))
  );

  router.get(
    "/reservation-drafts/:id",
    handleQueryRequest(getReservationRequest.execute(dependencies))
  );

  return router;
};
