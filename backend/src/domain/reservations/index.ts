import { Router } from "express";
import * as db from "../../tools/db-client";

// TODO - Import from module. Doing .. out of the boundaries of
// reservations seems not correct
import { handleCommandRequest } from "../../handlers/command";
import { importReservation } from "./import-reservation";

const router = Router();

// Bootstrapping the actual dependencies for all commands
// The type of the dependencies for the commands are defined on each command
// Here we will need all the dependencies. If something is missing or
// the types do not match between the provided and the expected dependencies
// the compiler will complain about it
const defaultDependencies = {
  dbClient: db.connectClient(),
};

router.post(
  "/import-reservation",
  handleCommandRequest(importReservation(defaultDependencies))
);

export default router;
