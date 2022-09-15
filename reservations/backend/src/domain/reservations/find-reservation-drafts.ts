import { Query } from "../../types";

import { BusinessError } from "../../errors";

export type Dependencies = {
  dbClient: {
    query: (
      statement: string,
      params: any[]
    ) => Promise<{ rows: any[]; totalCount: number }>;
  };
};

const withReservations = (
  data: [any | null, BusinessError | null]
): data is [any, null] => {
  const [reservation, err] = data;

  return !!reservation && !err;
};

// TODO : Add Pagination
export const execute: (dependencies: Dependencies) => Query<any[]> =
  (dependencies: Dependencies) => async (_input: any) => {
    console.log(`Retrieving data from DB`);

    console.log(`dependencies.dbClient:`, dependencies.dbClient);
    console.log(`dependencies.dbClient.query:`, dependencies.dbClient.query);

    const { rows: reservationRequests } = await dependencies.dbClient.query(
      "SELECT data FROM reservations.reservation_drafts;",
      []
    );

    console.log(`reservation requests:`, reservationRequests);
    return [reservationRequests, null];
  };
