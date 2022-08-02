import { Query } from "../types";
import { handleQueryRequest } from "./query";

const RequestFake = (query: unknown) => ({ query });

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
    json: (b: any) => {
      body = b;
      return Response;
    },
    end: () => {},
  };

  return Response;
};

describe("query-handler", () => {
  test("No error should send 200 status and data", () =>
    testQueryHandler(
      async () => ["this is the data", null],
      200,
      "this is the data"
    ));

  test("No error should send 400 and the right error message", () =>
    testQueryHandler(
      async () => [null, { status: 400, message: "This is an error" }],
      400,
      "This is an error"
    ));

  test("Should return 500 and generic message if an error is thrown", () =>
    testQueryHandler(
      async () => {
        throw new Error("This is a technical error");
      },
      500,
      "Unexpected server error"
    ));
});

const testQueryHandler = async (
  queryHandler: Query<string>,
  expectedStatus: number,
  expectedBody: any
) => {
  let responseFake = ResponseFake();
  await handleQueryRequest(queryHandler)(RequestFake(null), responseFake);

  let report = responseFake.get();
  expect(report.status).toEqual(expectedStatus);
  expect(report.body).toEqual(expectedBody);
};
