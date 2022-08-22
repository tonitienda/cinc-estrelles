import axios from "axios";

describe("health", () => {
  test("healthz endpoint works", async () => {
    const result = await axios.get("http://reservations-backend:3000/healthz");

    expect(result.status).toEqual(200);
  });
});
