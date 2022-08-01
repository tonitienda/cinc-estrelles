import express, { Request, Response } from "express";
import * as Dummy from "./domain/dummy";
import * as Reservation from "./domain/reservation";
import bodyParser from "body-parser";
import { handleCommandRequest } from "./handlers/command";
import { handleQueryRequest } from "./handlers/query";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.get("/healthz", (_: Request, res: Response) => {
  console.log("✅ healthz checked");
  res.send("✅");
});

app.post("/dummy", handleCommandRequest(Dummy.executeCommand));
app.get("/dummy", handleQueryRequest(Dummy.executeQuery));

app.post("/reservations", handleCommandRequest(Reservation.createReservation));

app.listen(PORT, () => {
  console.log(`🚀 Listening to ${PORT}`);
});
