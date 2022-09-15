import { ReservationRequest } from "../../models/reservation-request";
import validator, { validate } from "../../tools/validator";
import { Command } from "../../types";
import { v4 as uuid } from "uuid";

import { ResourceAcceptedWithErrors, UnknownError } from "../../errors";
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

const requestValidator = validator.getSchema<ReservationRequest>(
  "http://example.com/schemas/reservation-request.json"
);
const reservationValidator = validator.getSchema<Reservation>(
  "http://example.com/schemas/reservation.json"
);
const eventValidator = validator.getSchema<ReservationEvent>(
  "http://example.com/schemas/reservation-event.json"
);

if (!requestValidator) {
  throw new Error("Validator for reservation-request could not be created");
}
if (!reservationValidator) {
  throw new Error("Validator for reservation could not be created");
}
if (!eventValidator) {
  throw new Error("Validator for reservation-event could not be created");
}

const saveData = async (
  dependencies: Dependencies,
  table: string,
  id: string,
  data: any,
  eventsTable: string,
  eventsRefidColumn: string,
  eventType: string,
  // TODO - This is a antipattern. Refactor the code
  needsValidation: boolean
) => {
  console.log(`id:`, id, `data:`, data);
  const reservation = { id, ...data };

  const reservationEvent = {
    header: {
      id: uuid(),
      type: eventType,
      timestamp: Math.floor(new Date().getTime() / 1000),
    },
    body: reservation,
  };

  if (needsValidation) {
    const [_, err] = validate(reservationValidator, reservation);

    if (err) {
      console.error(
        `The reservation is not well formed: ${JSON.stringify(
          reservation,
          null,
          2
        )} . Errors: ${JSON.stringify(err, null, 2)}`
      );
      throw new Error("Unexpected error");
    }

    const [__, err2] = validate(eventValidator, reservationEvent);

    if (err2) {
      console.error(
        `The reservation event is not well formed: ${JSON.stringify(
          reservationEvent,
          null,
          2
        )} . Errors: ${JSON.stringify(err2, null, 2)}`
      );
      throw new Error("Unexpected error");
    }
  }

  const eventId = uuid();
  await dependencies.dbClient.executeTransaction([
    {
      statement: `INSERT INTO reservations.${table} (id, data)
  VALUES ($1, $2);`,
      params: [id, { id, ...data }],
    },
    {
      statement: `INSERT INTO reservations.${eventsTable} (id, ${eventsRefidColumn}, data)
  VALUES ($1, $2, $3);`,
      params: [
        eventId,
        id,
        {
          header: {
            id: eventId,
            type: eventType,
            timestamp: Math.floor(new Date().getTime() / 1000),
          },
          body: {
            id,
            ...data,
          },
        },
      ],
    },
    {
      statement: `NOTIFY ${eventsTable}, '${eventId}'`,
      params: [],
    },
  ]);
};

// If a reservation has the correct format it will be saved in the reservations table
// If there is some missing information we still need to store the request and process it manually
// before if can be considered a correct reservation.
export const execute: (dependencies: Dependencies) => Command =
  (dependencies: Dependencies) => async (input: any) => {
    const [reservationDraft, err] = validate(requestValidator, input);
    const newId = uuid();

    const resourceId = { id: newId };
    console.log(`reservationDraft:`, reservationDraft);
    if (err || !reservationDraft) {
      console.log(`Saving invalid reservation request`);
      await saveData(
        dependencies,
        "reservation_drafts",
        newId,
        input,
        "reservation_draft_events",
        "reservation_draft_id",
        "reservation-request.received",
        false
      );

      let error = err
        ? ResourceAcceptedWithErrors(JSON.stringify(resourceId))
        : UnknownError();

      return [null, error];
    }

    console.log(`Saving reservation:`, reservationDraft);
    await saveData(
      dependencies,
      "reservations",
      newId,
      reservationDraft,
      "reservation_events",
      "reservation_id",
      "reservation.received",
      true
    );

    return [resourceId, null];
  };
