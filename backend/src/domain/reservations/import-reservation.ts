import { ReservationRequest } from "../../models/reservation-request";
import ReservationRequestSchema from "../../schemas/reservation-request.json";
import ReservationSchema from "../../schemas/reservation.json";
import ReservationEventSchema from "../../schemas/reservation-event.json";
import validator, { makeValidator, validate } from "../../tools/validator";
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
  "reservation-request"
);
const reservationValidator = validator.getSchema<Reservation>("reservation");
const eventValidator =
  validator.getSchema<ReservationEvent>("reservation-event");

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
  events_table: string,
  events_refid_column: string,
  eventType: string,
  // TODO - This is a antipattern. Refactor the code
  needsValidation: boolean
) => {
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
        `The reservation is not well formed: ${reservation} . Errors: ${err}`
      );
      throw new Error("Unexpected error");
    }

    const [__, err2] = validate(eventValidator, reservationEvent);

    if (err2) {
      console.error(
        `The reservation event is not well formed: ${reservationEvent} . Errors: ${err2}`
      );
      throw new Error("Unexpected error");
    }
  }

  await dependencies.dbClient.executeTransaction([
    {
      statement: `INSERT INTO reservations.${table} (id, data)
  VALUES ($1, $2);`,
      params: [id, { id, ...data }],
    },
    {
      statement: `INSERT INTO reservations.${events_table} (id, ${events_refid_column}, data)
  VALUES ($1, $2, $3);`,
      params: [
        uuid(),
        id,
        {
          header: {
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
  ]);
};

// If a reservation has the correct format it will be saved in the reservations table
// If there is some missing information we still need to store the request and process it manually
// before if can be considered a correct reservation.
export const execute: (dependencies: Dependencies) => Command =
  (dependencies: Dependencies) => async (input: any) => {
    const [reservationRequest, err] = validate(requestValidator, input);
    const newId = uuid();

    const resourceId = { id: newId };

    if (err || !reservationRequest) {
      await saveData(
        dependencies,
        "reservation_requests",
        newId,
        input,
        "reservation_request_events",
        "reservation_request_id",
        "reservation-request.received",
        false
      );

      let error = err
        ? ResourceAcceptedWithErrors(err.message)
        : UnknownError();

      return [null, error];
    }

    await saveData(
      dependencies,
      "reservations",
      newId,
      input,
      "reservation_events",
      "reservation_id",
      "reservation.received",
      true
    );

    return [resourceId, null];
  };
