import DummySchema from "../../schemas/dummy.json";
import { makeValidator, validate } from "../../tools/validator";

const validator = makeValidator(DummySchema);

type BusinessError = {
  status: number;
  message: string;
};

const ResourceNotFound = (resourceType: string): BusinessError => ({
  status: 404,
  message: `The ${resourceType} could not be found.`,
});

export const execute = (input: unknown): void => {
  const [data, err] = validate(validator, input);

  // TODO - See error handling
  if (err) {
    throw err;
  }

  return;
};
