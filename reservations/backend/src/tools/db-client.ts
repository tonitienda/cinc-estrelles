import { Pool } from "pg";

// TODO: use env vars for credentials
const pool = new Pool({
  host: "reservations-db",
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

  pool.query(`SET search_path TO reservations;`);

  return { executeTransaction, query, queryOne };
};

const executeTransaction = async (
  statements: { statement: string; params: any[] }[]
): Promise<void> => {
  try {
    await pool.query("BEGIN;");

    for (const { statement, params } of statements) {
      console.log(statement);
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

type QueryResult = {
  rows: any[];
  totalCount: number;
};

const query = async (
  statement: string,
  params: any[]
): Promise<QueryResult> => {
  try {
    console.log(`Inside query`);
    const data = await pool.query(statement, params);

    console.log(`Data`, data);
    // TODO -  We need to run a special query to get all rows for a paged query
    return { totalCount: data.rowCount, rows: data.rows.map((r) => r.data) };
  } catch (err) {
    console.error(err);

    return { rows: [], totalCount: 0 };
  }
};

const queryOne = async (
  statement: string,
  params: any[]
): Promise<any | null> => {
  try {
    console.log(`Inside query:`, statement, params);
    const data = await pool.query(statement, params);

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
