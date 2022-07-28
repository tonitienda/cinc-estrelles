import { Command, Request, Response } from "../types";

export const handleCommandRequest =
  (command: Command) => (req: Request, res: Response) => {
    try {
      const [_, err] = command(req.body);

      if (err) {
        res.status(err.status).send(err.message);
      } else {
        res.status(201).end();
      }
    } catch (err: any) {
      // TODO - Trace properly
      console.log(err.message);
      res.status(500).send("Unexpected server error");
    }
  };
