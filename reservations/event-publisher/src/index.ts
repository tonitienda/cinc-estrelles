import { connect } from "./system";

connect().then((dependencies) => {
  dependencies.dbClient.onNotification(({ channel, payload }) => {
    console.log({ channel, payload });
  });

  dependencies.dbClient.queryOne(`LISTEN  test;`, []);

  setInterval(() => {
    dependencies.dbClient.queryOne(`NOTIFY test, 'payload_test'`, []);
  }, 1000);
});
