import { AnyValidateFunction } from "ajv/dist/core";
import { PublicReservationEvent } from "./models/public-reservation-event";
import { PublicReservationRequestEvent } from "./models/public-reservation-request-event";

import { connect } from "./system";
import validator, { validate } from "./tools/validator";

const targetChannels = ["reservation_events", "reservation_request_events"];

const reservationEventValidator = validator.getSchema<PublicReservationEvent>(
  "http://example.com/schemas/public-reservation-event.json"
);

const reservationRequestEventValidator =
  validator.getSchema<PublicReservationRequestEvent>(
    "http://example.com/schemas/public-reservation-request-event.json"
  );

if (!reservationEventValidator) {
  throw new Error(`Reservation Event Validator could not be found.`);
}

if (!reservationRequestEventValidator) {
  throw new Error(`Reservation Request Event Validator could not be found.`);
}

// TODO - See how to express as dictionary:
// TODO - See how to use generics
const getValidatorByChannel: (
  channel: string
) =>
  | AnyValidateFunction<PublicReservationEvent>
  | AnyValidateFunction<PublicReservationEvent> = (channel: string) => {
  switch (channel) {
    case "reservation_events":
      return reservationEventValidator;
    case "reservation_request_events":
      return reservationRequestEventValidator;
    default:
      throw new Error(`${channel} not supported. Data cannot be validated`);
  }
};

// const ValidatorByChannel: { [key: string]: ValidateFunction<exists T> } = {
//   reservation_events: reservationEventValidator,
//   reservation_request_events: reservationRequestEventValidator,
// };

// TODO - See the information that usually is part of the events headers
connect()
  .then(async (dependencies) => {
    dependencies.dbClient.onNotification(async ({ channel, payload }) => {
      const eventId = payload;

      const event = await dependencies.dbClient.queryOne(
        `SELECT data FROM reservations.${channel} WHERE id = $1`,
        [eventId]
      );

      const validator = getValidatorByChannel(channel);

      // Make sure that the event is valid before publishing out of the bounded context
      const [validEvent, err] = validate(validator, event);

      if (err) {
        // For now we log the error. Not sure about what to do in this case
        console.error(
          `Error validating the event to be published:`,
          channel,
          err
        );
        return;
      }

      if (!validEvent) {
        // For now we log the error. Not sure about what to do in this case
        console.error(
          `Error validating the event to be published:`,
          channel,
          "unknown error"
        );
        return;
      }

      console.log(`Publishing to`, channel);
      dependencies.broker.publish(channel, validEvent);
    });

    for (let channel of targetChannels) {
      console.log(`Subscribing to:`, `LISTEN  ${channel};`);
      await dependencies.dbClient.query(`LISTEN  ${channel};`);
    }
  })
  .catch((err) => console.log(`Could not connect:`, err));
