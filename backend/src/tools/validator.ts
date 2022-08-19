import Ajv, { Schema, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { InvalidRequest, BusinessError } from "../errors";
import fs from "fs";
import path from "path";
import eventHeaderSchema from "../schemas/event-header.json";
import reservationShapeSchema from "../schemas/reservation-shape.json";
import reservationRequestSchema from "../schemas/reservation-request.json";
import reservationSchema from "../schemas/reservation.json";
import reservationEventSchema from "../schemas/reservation-event.json";

const ajv = new Ajv({ removeAdditional: true, allErrors: true });
addFormats(ajv);

const ajvWithSchemas = ajv
  .addSchema(eventHeaderSchema)
  .addSchema(reservationShapeSchema)
  .addSchema(reservationSchema, "reservation")
  .addSchema(reservationEventSchema, "reservation-event")
  .addSchema(reservationRequestSchema, "reservation-request");
// const ajvWithSchemas = fs
//   .readdirSync(path.join(__dirname, "..", "schemas"))
//   .reduce((ajv, filename) => {
//     console.log(filename);
//     const schemaPath = path.join(__dirname, "..", "schemas", filename);
//     console.log(schemaPath);
//     const schema = JSON.parse(fs.readFileSync(schemaPath).toString());
//     console.log(schema);
//     return ajv.addSchema(schema, filename.replace(".json", ""));
//   }, ajv);

export default ajvWithSchemas;

export const makeValidator = <T>(schema: any) =>
  ajvWithSchemas.compile<T>(schema);

export const validate = <T>(
  validator: ValidateFunction<T>,
  data: unknown
): [T | null, BusinessError | null] => {
  const valid = validator(data);

  if (valid || !validator.errors) {
    return [data as T, null];
  }

  return [null, InvalidRequest(JSON.stringify(validator.errors))];
};
