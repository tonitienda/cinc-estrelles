import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import eventHeaderSchema from "../schemas/event-header.json";
import reservationShapeSchema from "../schemas/public-reservation-shape.json";
import reservationEventSchema from "../schemas/public-reservation-event.json";

import reservationRequestEventSchema from "../schemas/public-reservation-request-event.json";
import reservationRequestShapeSchema from "../schemas/public-reservation-request-shape.json";

const ajv = new Ajv({ removeAdditional: true, allErrors: true });
addFormats(ajv);

// TODO - See how to automate this part
const ajvWithSchemas = ajv
  .addSchema(eventHeaderSchema, "http://example.com/schemas/event-header.json")
  .addSchema(
    reservationShapeSchema,
    "http://example.com/schemas/public-reservation-shape.json"
  )
  .addSchema(
    reservationEventSchema,
    "http://example.com/schemas/public-reservation-event.json"
  )
  .addSchema(
    reservationEventSchema,
    "http://example.com/schemas/public-reservation-request-shape.json"
  )
  .addSchema(
    reservationEventSchema,
    "http://example.com/schemas/public-reservation-request-event.json"
  );

export default ajvWithSchemas;

export const makeValidator = <T>(schema: any) =>
  ajvWithSchemas.compile<T>(schema);

export const validate = <T>(
  validator: ValidateFunction<T>,
  data: unknown
): [T | null, Error | null] => {
  // We do not want to affect the original data
  const clonedData = JSON.parse(JSON.stringify(data));

  const valid = validator(clonedData);

  if (valid || !validator.errors) {
    return [clonedData as T, null];
  }

  return [null, new Error(JSON.stringify(validator.errors))];
};
