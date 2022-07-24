import { Given, When, Then } from "@cucumber/cucumber";
import axios from "axios";
import { strict as assert } from "assert";

// TODO - See this. State should be initialized before every test runs
//        and should not be shared to allow paralel execution
let world: any = {};

Given("Backend is ready", async () => {
  const result = await axios.get("http://backend:3000/healthz");

  assert(result.status === 200);
});

When("the greeter says hello", () => {
  console.log("Hello");
});

Then("I should have heard {string}", (expectedResponse) => {
  console.log(`Heard hello`);
});

const ignored = (str: string) => str === "<ignore>";

When(
  "the client sends {string}, {string}, {string}, {string}",
  async (id, name, description, extra) => {
    const data = {
      ...(ignored(id) ? {} : { id }),
      ...(ignored(name) ? {} : { name }),
      ...(ignored(description) ? {} : { description }),
      ...(ignored(extra) ? {} : { extra }),
    };

    try {
      const result = await axios.post("http://backend:3000/dummy", data);

      world.result = result;
    } catch (error: any) {
      world.result = error.response;
    }
  }
);

Then("the status should be {int}", (status) => {
  assert.strictEqual(world.result.status, status);
});
