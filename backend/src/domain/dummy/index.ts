import DummySchema from "../../schemas/dummy.json";
import { makeValidator, validate } from "../../tools/validator";

const validator = makeValidator(DummySchema);

export const execute = (input: unknown): void => {
  const [data, err] = validate(validator, input);

  // TODO - See error handling
  if (err) {
    throw err;
  }

  return;
};
