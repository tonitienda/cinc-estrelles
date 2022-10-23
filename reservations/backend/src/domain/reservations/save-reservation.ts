import validator, { validate } from "../../tools/validator";
import { Command } from "../../types";
import { v4 as uuid } from "uuid";

import { InvalidRequest, UnknownError } from "../../errors";
import { Reservation } from "../../models/reservation";
import { ReservationEvent } from "../../models/reservation-event";

export type Dependencies = {
  dbClient: {
    executeTransaction: (
      statements: { statement: string; params: any[] }[]
    ) => Promise<void>;
  };
  broker: {
    publish: (topic: string, data: object) => void;
  };
};

const reservationValidator = validator.getSchema<Reservation>(
  "http://example.com/schemas/reservation.json"
);
const eventValidator = validator.getSchema<ReservationEvent>(
  "http://example.com/schemas/reservation-event.json"
);

if (!reservationValidator) {
  throw new Error("Validator for reservation could not be created");
}
if (!eventValidator) {
  throw new Error("Validator for reservation-event could not be created");
}

const saveData = async (
  dependencies: Dependencies,
  reservation: any,
  eventType: string
) => {
  const reservationEvent = {
    header: {
      id: uuid(),
      type: eventType,
      timestamp: Math.floor(new Date().getTime() / 1000),
    },
    body: reservation,
  };

  console.log("\n\n\n\n\n 2 ----");
  const [__, err] = validate(eventValidator, reservationEvent);

  if (err) {
    console.error(
      `The reservation event is not well formed: ${JSON.stringify(
        reservationEvent,
        null,
        2
      )} . Errors: ${JSON.stringify(err, null, 2)}`
    );
    throw new Error("Unexpected error");
  }

  console.log("\n\n\n\n\n 3 ----");

  const eventId = uuid();

  console.log("\n\n\n\n\n 4 ----");
  await dependencies.dbClient.executeTransaction([
    {
      statement: `UPDATE reservations SET data = $1 WHERE id = $2;`,
      params: [reservation, reservation.id],
    },
    {
      statement: `DELETE FROM reservation_drafts WHERE id = $1;`,
      params: [reservation.id],
    },
    {
      statement: `INSERT INTO reservation_events (id, reservation_id, data)
  VALUES ($1, $2, $3);`,
      params: [
        eventId,
        reservation.id,
        {
          header: {
            id: eventId,
            type: eventType,
            timestamp: Math.floor(new Date().getTime() / 1000),
          },
          body: reservation,
        },
      ],
    },
    {
      statement: `NOTIFY reservation_events, '${eventId}';`,
      params: [],
    },
  ]);

  console.log("\n\n\n\n\n 5 ----");
};

// If a reservation has the correct format it will be saved in the reservations table
// If there is some missing information we still need to store the request and process it manually
// before if can be considered a correct reservation.
export const execute: (dependencies: Dependencies) => Command =
  (dependencies: Dependencies) => async (input: any) => {
    console.log("\n\n\n\n\n 0 ----");
    console.log(input);

    const [reservation, err] = validate(reservationValidator, input);

    if (err || !reservation) {
      let error = err ? InvalidRequest(JSON.stringify(err)) : UnknownError();

      return [null, error];
    }
    console.log("\n\n\n\n\n 1 ----");
    await saveData(dependencies, reservation, "reservation.changed");

    console.log("\n\n\n\n\n 6 ----");
    return [{ id: reservation.id }, null];
  };
