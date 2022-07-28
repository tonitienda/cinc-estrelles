import { BusinessError } from "../../errors";
import DummySchema from "../../schemas/dummy.json";
import { makeValidator, validate } from "../../tools/validator";
import { Command, Query } from "../../types";

const validator = makeValidator(DummySchema);

export const executeCommand: Command = (input: unknown) => {
  const [_data, err] = validate(validator, input);

  if (err) {
    return [null, err];
  }

  return [null, null];
};

type Dummy = {
  name: string;
};

export const executeQuery: Query<Dummy> = (input: unknown) => {
  const [_data, err] = validate(validator, input);

  if (err) {
    return [null, err];
  }

  return [
    {
      name: "test",
    },
    null,
  ];
};
