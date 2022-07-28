import { Query, Request, Response } from "../types";

export const handleQueryRequest =
  <TResult>(query: Query<TResult>) =>
  (req: Request, res: Response) => {
    try {
      const [data, err] = query(req.body);

      if (err) {
        res.status(err.status).send(err.message);
      } else {
        res.status(200).send(data);
      }
    } catch (err: any) {
      // TODO - Trace properly
      console.log(err.message);
      res.status(500).send("Unexpected server error.");
    }
  };
