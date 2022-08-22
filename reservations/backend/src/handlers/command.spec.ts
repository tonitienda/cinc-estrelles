import { Command, ResourceId } from "../types";
import { handleCommandRequest } from "./command";
import { FakeResponse } from "../test-tools/fake-response";
import { FakeRequest } from "../test-tools/fake-request";

describe("command-handler", () => {
  test("No error and no body should send 201 status and empty body", () =>
    testCommandHandler(async () => [null, null], 201, null));

  test("No error and body should send 200 status and body", () =>
    testCommandHandler(async () => [{ id: "hello" }, null], 200, {
      id: "hello",
    }));

  test("400 - Error should send 400 status and the right error message", () =>
    testCommandHandler(
      async () => [null, { status: 400, message: "This is an error" }],
      400,
      "This is an error"
    ));

  test("500 - Error should send 500 status and the right error message", () =>
    testCommandHandler(
      async () => [null, { status: 500, message: "This is another error" }],
      500,
      "This is another error"
    ));

  test("Should return 500 and generic message if an error is thrown", () =>
    testCommandHandler(
      async () => {
        throw new Error("This is a technical error");
      },
      500,
      "Unexpected server error"
    ));
});

const testCommandHandler = async (
  commandHandler: Command,
  expectedStatus: number,
  expectedBody: any
) => {
  let responseFake = FakeResponse();

  await handleCommandRequest(commandHandler)(FakeRequest(null), responseFake);

  let report = responseFake.get();
  expect(report.status).toEqual(expectedStatus);
  expect(report.body).toEqual(expectedBody);
};
