import express, { Request, Response } from "express";
import * as Dummy from "./domain/dummy";
import bodyParser from "body-parser";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.get("/healthz", (_: Request, res: Response) => {
  console.log("✅ healthz checked");
  res.send("✅");
});

// TODO - Implement basic version of validation
app.post("/dummy", (req: Request, res: Response) => {
  try {
    Dummy.execute(req.body);

    res.send();
  } catch (err: any) {
    res.status(400).end();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening to ${PORT}`);
});
