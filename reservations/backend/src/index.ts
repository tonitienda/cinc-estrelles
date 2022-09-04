import express, { Request, Response } from "express";
import * as reservations from "./domain/reservations";
import bodyParser from "body-parser";
import * as system from "./system";
import cors from "cors";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/healthz", (_: Request, res: Response) => {
  console.log("✅ healthz checked");
  res.send("✅");
});

const bootstrap = async () => {
  const systemDependencies = await system.connect();

  // Having multiple services could lead to url collision.
  // One solution would be adding a prefix like:
  // app.use('reservations', reservations)
  // So the url of the request would be:
  //    /reservations/import
  // instead of:
  //    /import-reservation
  app.use(reservations.get(systemDependencies));
};

bootstrap().then(() => {
  console.log(`🔌 System bootstrapped`);
  app.listen(PORT, () => {
    console.log(`🚀 Listening to ${PORT}`);
  });
});
