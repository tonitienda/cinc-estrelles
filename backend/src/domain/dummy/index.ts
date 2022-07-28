import { BusinessError } from "../../errors";
import CmdSchema from "./dummy-cmd-req.json";
import QuerySchema from "./dummy-query-req.json";
import { makeValidator, validate } from "../../tools/validator";
import { Command, Query } from "../../types";

const commandValidator = makeValidator<Dummy>(CmdSchema);
const queryValidator = makeValidator<DummyRequest>(QuerySchema);

export const executeCommand: Command = (input: unknown) => {
  const [_data, err] = validate(commandValidator, input);

  if (err) {
    return [null, err];
  }

  return [null, null];
};

type Dummy = {
  name: string;
};

type DummyRequest = {
  id: string;
};

export const executeQuery: Query<{ name: string }> = (input: unknown) => {
  const [data, err] = validate(queryValidator, input);

  if (err) {
    return [null, err];
  }

  if (!data) {
    return [null, null];
  }

  return [{ name: `Test${data.id.substring(0, 2)}` }, null];
};
