import { Command } from "../types";
import { handleCommandRequest } from "./command";

const RequestFake = (body: unknown) => ({ body });

// We can add constraints. status, send, etc should
// be called only once
const ResponseFake = () => {
  let status = -1;
  let body: unknown = null;

  const Response = {
    get: () => ({ status, body }),
    status: (s: number) => {
      status = s;
      return Response;
    },
    send: (b: unknown) => {
      body = b;
      return Response;
    },
    end: () => {},
  };

  return Response;
};

describe("command-handler", () => {
  test("No error should send 201 status and empty body", () => {
    testCommandHandler(() => [null, null], 201, null);
  });

  test("No error should send 400 and the right error message", () => {
    testCommandHandler(
      () => [null, { status: 400, message: "This is an error" }],
      400,
      "This is an error"
    );
  });

  test("Should return 500 and generic message if an error is thrown", () => {
    testCommandHandler(
      () => {
        throw new Error("This is a technical error");
      },
      500,
      "Unexpected server error"
    );
  });
});

const testCommandHandler = (
  commandHandler: Command,
  expectedStatus: number,
  expectedBody: any
) => {
  let responseFake = ResponseFake();
  handleCommandRequest(commandHandler)(RequestFake(null), responseFake);

  let report = responseFake.get();
  expect(report.status).toEqual(expectedStatus);
  expect(report.body).toEqual(expectedBody);
};
