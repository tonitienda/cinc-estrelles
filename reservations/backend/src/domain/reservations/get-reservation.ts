import validator, { validate } from "../../tools/validator";
import { Query } from "../../types";

import { InvalidRequest, ResourceNotFound, UnknownError } from "../../errors";
import { Reservation } from "../../models/reservation";
import { ResourceById } from "../../models/resource-by-id";

export type Dependencies = {
  dbClient: {
    queryOne: (statement: string, params: any[]) => Promise<any | null>;
  };
};

const reservationValidator = validator.getSchema<Reservation>(
  "http://example.com/schemas/reservation.json"
);

const resourceByIdValidator = validator.getSchema<ResourceById>(
  "http://example.com/schemas/resource-by-id.json"
);

if (!reservationValidator) {
  throw new Error("Validator for reservation could not be created");
}

if (!resourceByIdValidator) {
  throw new Error("Validator for resource by id could not be created");
}

export const execute: (dependencies: Dependencies) => Query<Reservation> =
  (dependencies: Dependencies) => async (input: any) => {
    console.log(`Retrieving data from DB`, input);

    const [request, err] = validate(resourceByIdValidator, input);

    if (err || !request) {
      let error = err ? InvalidRequest(err.message) : UnknownError();

      return [null, error];
    }

    const result = await dependencies.dbClient.queryOne(
      "SELECT data FROM reservations WHERE id = $1;",
      [request.id]
    );

    console.log(`result:`, result);

    if (!result) {
      return [null, ResourceNotFound("reservation")];
    }

    const [reservation, err2] = validate(reservationValidator, result);

    if (err2) {
      console.log(
        `There was an error in the data from the DB. Data:`,
        result,
        `error:`,
        err2.message
      );

      return [null, UnknownError()];
    }

    if (!reservation) {
      console.error(
        `No error validating the reservation, but there is no data returned.`
      );
      return [null, UnknownError()];
    }

    return [reservation, null];
  };
