import validator, { makeValidator, validate } from "../../tools/validator";
import { Query } from "../../types";

import { BusinessError } from "../../errors";
import { Reservation } from "../../models/reservation";

export type Dependencies = {
  dbClient: {
    query: (
      statement: string,
      params: any[]
    ) => Promise<{ rows: any[]; totalCount: number }>;
  };
};

const reservationValidator = validator.getSchema<Reservation>(
  "http://example.com/schemas/reservation.json"
);

if (!reservationValidator) {
  throw new Error("Validator for reservation could not be created");
}

const withReservations = (
  data: [Reservation | null, BusinessError | null]
): data is [Reservation, null] => {
  const [reservation, err] = data;

  return !!reservation && !err;
};

// TODO : Add Pagination
export const execute: (dependencies: Dependencies) => Query<Reservation[]> =
  (dependencies: Dependencies) => async (_input: any) => {
    console.log(`Retrieving data from DB`);

    console.log(`dependencies.dbClient:`, dependencies.dbClient);
    console.log(`dependencies.dbClient.query:`, dependencies.dbClient.query);

    const result = await dependencies.dbClient.query(
      "SELECT data FROM reservations.reservations;",
      []
    );

    console.log(`Rows:`, result.rows);
    const reservationValidations = result.rows.map((row) =>
      validate(reservationValidator, row)
    );

    const errors = reservationValidations
      .filter(([_, err]) => err)
      .map(([_, err]) => err);
    const reservations = reservationValidations
      .filter(withReservations)
      .map(([reservation, _]) => reservation);

    if (errors.length) {
      console.error(
        `Errors found when validating reservations in the DB:`,
        errors
      );
    }

    console.log(`reservations:`, reservations);
    return [reservations, null];
  };
