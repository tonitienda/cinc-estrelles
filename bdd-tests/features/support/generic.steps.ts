import { Given, When, Then } from "@cucumber/cucumber";
import axios from "axios";
import { strict as assert } from "assert";

Given("Backend is ready", async () => {
  const result = await axios.get("http://backend:3000/healthz");

  assert(result.status === 200);
});
