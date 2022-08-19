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

  return { executeTransaction, query: pool.query };
};

export const executeTransaction = async (
  statements: { statement: string; params: any[] }[]
): Promise<void> => {
  try {
    await pool.query("BEGIN;");

    for (const { statement, params } of statements) {
      await pool.query(statement, params);
    }
    await pool.query("COMMIT;");
  } catch (err) {
    console.error(err);

    // Do not await the rollback. If there is a problem with the connection
    // the rollback will also fail but we can ignore the error
    pool.query("ROLLBACK;");

    throw err;
  }
};
