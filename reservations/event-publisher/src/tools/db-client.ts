import { Client, Notification } from "pg";

// TODO: use env vars for credentials
const client = new Client({
  host: "reservations-db",
  port: 5432,
  user: "ruteho",
  password: "abcde12345",
  // This is long because in the CI the DB takes time to initialize. // TODO Set connection timeout it in ENV VARS
  connectionTimeoutMillis: 100000,
});

export const connectClient = async () => {
  client.on("error", (e) => {
    console.error("DB error", e);
  });

  await client.connect();

  return { queryOne, onNotification };
};

const onNotification = (
  callback: (message: { channel: string; payload: string | null }) => void
) =>
  client.on("notification", ({ channel, payload }) =>
    callback({
      channel,
      payload: payload || null,
    })
  );

const queryOne = async (
  statement: string,
  params: any[]
): Promise<any | null> => {
  try {
    console.log(`Inside query:`, statement, params);
    const data = await client.query(statement, params);

    console.log(`Data`, data);

    if (data.rowCount > 1) {
      throw Error(`The query returned more than one row: ${statement}`);
    }

    if (data.rowCount === 0) {
      return null;
    }

    const value = data.rows[0];

    console.log(`Returning value:`, value.data);
    return value.data || null;
  } catch (err) {
    console.error(err);

    return null;
  }
};
