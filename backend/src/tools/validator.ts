import Ajv, { Schema, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { InputNotValid, BusinessError } from "../errors";

const ajv = new Ajv({ removeAdditional: true, allErrors: true });
addFormats(ajv);

export const makeValidator = <T>(schema: any) => ajv.compile<T>(schema);

export const validate = <T>(
  validator: ValidateFunction<T>,
  data: unknown
): [T | null, BusinessError | null] => {
  const valid = validator(data);

  if (valid || !validator.errors) {
    return [data as T, null];
  }

  return [null, InputNotValid(JSON.stringify(validator.errors))];
};
