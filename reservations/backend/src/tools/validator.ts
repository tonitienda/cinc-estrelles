import Ajv, { Schema, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { InvalidRequest, BusinessError } from "../errors";
import eventHeaderSchema from "../schemas/event-header.json";
import reservationShapeSchema from "../schemas/reservation-shape.json";
import reservationRequestSchema from "../schemas/reservation-request.json";
import reservationSchema from "../schemas/reservation.json";
import reservationEventSchema from "../schemas/reservation-event.json";
import resourceByIdSchema from "../schemas/resource-by-id.json";

const ajv = new Ajv({ removeAdditional: true, allErrors: true });
addFormats(ajv);

// TODO - See how to automate this part
const ajvWithSchemas = ajv
  .addSchema(
    resourceByIdSchema,
    "http://example.com/schemas/resource-by-id.json"
  )
  .addSchema(eventHeaderSchema, "http://example.com/schemas/event-header.json")
  .addSchema(
    reservationShapeSchema,
    "http://example.com/schemas/reservation-shape.json"
  )
  .addSchema(reservationSchema, "http://example.com/schemas/reservation.json")
  .addSchema(
    reservationEventSchema,
    "http://example.com/schemas/reservation-event.json"
  )
  .addSchema(
    reservationRequestSchema,
    "http://example.com/schemas/reservation-request.json"
  );

export default ajvWithSchemas;

export const makeValidator = <T>(schema: any) =>
  ajvWithSchemas.compile<T>(schema);

export const validate = <T>(
  validator: ValidateFunction<T>,
  data: unknown
): [T | null, BusinessError | null] => {
  // We do not want to affect the original data
  const clonedData = JSON.parse(JSON.stringify(data));

  const valid = validator(clonedData);

  if (valid || !validator.errors) {
    return [clonedData as T, null];
  }

  return [null, InvalidRequest(JSON.stringify(validator.errors))];
};
