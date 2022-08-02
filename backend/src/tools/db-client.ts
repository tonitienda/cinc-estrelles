import { Pool } from "pg";

// TODO: use env vars for credentials
const pool = new Pool({
  host: "database",
  port: 5432,
  user: "ruteho",
  password: "abcde12345",
  // This is long because in the CI the DB takes time to initialize. // TODO Set connection timeout it in ENV VARS
  connectionTimeoutMillis: 100000,
});

export const connectClient = () => {
  pool.on("error", (e) => {
    console.error("DB error", e);
  });

  pool.connect();

  return pool;
};
