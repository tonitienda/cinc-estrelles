import validator, { validate } from "../../tools/validator";
import { Query } from "../../types";

import { InvalidRequest, ResourceNotFound, UnknownError } from "../../errors";
import { ResourceById } from "../../models/resource-by-id";

export type Dependencies = {
  dbClient: {
    queryOne: (statement: string, params: any[]) => Promise<any | null>;
  };
};

const resourceByIdValidator = validator.getSchema<ResourceById>(
  "http://example.com/schemas/resource-by-id.json"
);

if (!resourceByIdValidator) {
  throw new Error("Validator for resource by id could not be created");
}

export const execute: (dependencies: Dependencies) => Query<any> =
  (dependencies: Dependencies) => async (input: any) => {
    console.log(`Retrieving data from DB`, input);

    const [request, err] = validate(resourceByIdValidator, input);

    if (err || !request) {
      let error = err ? InvalidRequest(err.message) : UnknownError();

      return [null, error];
    }

    const reservationDraft = await dependencies.dbClient.queryOne(
      "SELECT data FROM reservations.reservation_drafts WHERE id = $1;",
      [request.id]
    );

    if (!reservationDraft) {
      return [null, ResourceNotFound("reservation request")];
    }

    return [reservationDraft, null];
  };
