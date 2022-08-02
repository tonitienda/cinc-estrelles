import express, { Request, Response } from "express";
import reservations from "./domain/reservations";
import bodyParser from "body-parser";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.get("/healthz", (_: Request, res: Response) => {
  console.log("✅ healthz checked");
  res.send("✅");
});

// Having multiple services could lead to url collision.
// One solution would be adding a prefix like:
// app.use('reservations', reservations)
// So the url of the request would be:
//    /reservations/import
// instead of:
//    /import-reservation
app.use(reservations);

app.listen(PORT, () => {
  console.log(`🚀 Listening to ${PORT}`);
});
