import { Command, Request, Response } from "../types";

export const handleCommandRequest =
  (command: Command) => async (req: Request, res: Response) => {
    try {
      const [data, err] = await command(req.body);

      if (err) {
        return res.status(err.status).send(err.message);
      }

      if (data === null) {
        return res.status(201).end();
      }

      return res.status(200).send(data);
    } catch (err: any) {
      // TODO - Trace properly
      console.log(err.message);
      res.status(500).send("Unexpected server error");
    }
  };
