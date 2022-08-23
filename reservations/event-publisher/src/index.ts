import { connect } from "./system";

const targetChannels = ["reservation_events"];

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

      console.log(`Publishing to`, channel);
      dependencies.broker.publish(channel, event);
    });

    for (let channel of targetChannels) {
      console.log(`Subscribing to:`, `LISTEN  ${channel};`);
      await dependencies.dbClient.query(`LISTEN  ${channel};`);
    }
  })
  .catch((err) => console.log(`Could not connect:`, err));
