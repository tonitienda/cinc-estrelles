import Ajv, { Schema, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ removeAdditional: true });
addFormats(ajv);

export const makeValidator = <T>(schema: any) => ajv.compile<T>(schema);

export const validate = <T>(
  validator: ValidateFunction<T>,
  data: unknown
): [T | null, Error | null] => {
  const valid = validator(data);

  if (valid) {
    return [data as T, null];
  }

  return [null, new Error(validator.errors?.toString())];
};
