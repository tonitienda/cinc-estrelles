import { ValidationError } from "json-schema-to-typescript";
import { PublicReservationEvent } from "./models/public-reservation-event";
import { connect } from "./system";
import validator, { validate } from "./tools/validator";

const targetChannels = ["reservation_events"];

const eventValidator = validator.getSchema<PublicReservationEvent>(
  "http://example.com/schemas/public-reservation-event.json"
);

if (!eventValidator) {
  throw new Error(`Event Validator could not be found.`);
}

// TODO - Validate outgoing events
// TODO - Publish also the requested invalid reservations (no schema verification is possible)
// TODO - See the information that usually is part of the events headers
// TODO - Add Awaiting events in the BDD tests

connect()
  .then(async (dependencies) => {
    dependencies.dbClient.onNotification(async ({ channel, payload }) => {
      const eventId = payload;
      console.log(`Notification received:`, channel, eventId);
      // TODO - Verify that entityId is uuid
      const event = await dependencies.dbClient.queryOne(
        `SELECT data FROM reservations.${channel} WHERE id = $1`,
        [eventId]
      );
      console.log("Event:", event);

      // Make sure that the event is valid before publishing out of the bounded context
      const [validEvent, err] = validate(eventValidator, event);

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
